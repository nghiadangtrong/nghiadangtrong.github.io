const UserModel = require("../models/user");

const authUser = async (request, response, next) => {
  try {
    let userId = request.user.sub;
    let user = await UserModel.findById(userId);

    if(!user) {
      throw new Error('User not found!')
    }

    user['hash_password'] = null;
    user['photo'] = null;
    request.profile = user;
    next();
  } catch(error) {
    return response.status(400).json({ error: error.message  })
  }
}

module.exports = authUser;
