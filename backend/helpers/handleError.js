
const ThrowException = (code = 400, message='Something went wrong' ) => {
  let error = new Error(message)
  error.code = code;
  throw error;
}


const HandleException = (error, response) => {
  let { code = 400, message = 'Something went wrong' } = error;

  if([11000, 11001].includes(code)) {
    code = 400;
    message = uniqueMessage(error);
  } else if(code <100 || code > 600) {
    code = 400;
  }
  return response.status(code).json({ error: message })
}

/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output;
    try {
        let fieldName = error.message.substring(error.message.lastIndexOf('.$') + 2, error.message.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};


module.exports = { ThrowException, HandleException }
