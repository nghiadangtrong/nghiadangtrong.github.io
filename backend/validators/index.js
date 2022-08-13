const { validationResult } = require("express-validator")

function convertErrors(errors = []) {
  if(!Array.isArray(errors) || errors.length <= 0) {
    return 
  } 
  return errors.reduce((prevData, currentData) => {
    let { param, msg } = currentData;
    if(!prevData[param]) {
      prevData[param] = msg
    }
    return prevData;
  }, {})
}

exports.runValidation = function (request, response, next) {
  const errors = validationResult(request);
  if(!errors.isEmpty()) {
    return response.status(422).json(convertErrors(errors.array()))
  }
  next();
}

