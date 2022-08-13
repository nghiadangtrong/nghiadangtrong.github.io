const UserModel = require("../models/user");
const { RoleType } = require("../configs/role");

const authAdmin = async (request, response, next) => {
  try {
    let adminId = request.user.sub;
    let admin = await UserModel.findById(adminId);

    if(!admin) { throw new Error("User not found!"); }

    if(admin.role !== RoleType.admin) {
      throw new Error("Admin Resource. Access Denied.")
    }

    admin['hash_password'] = null;
    admin['photo'] = null;
    request.profile = admin;
    next();
  } catch(error) {
    return response.status(400).json({ error: error.message })
  }
}

module.exports = authAdmin;
