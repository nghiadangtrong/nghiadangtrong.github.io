const expressJWT = require("express-jwt");
const { JWT_SECRET } = require('../configs/auth');

const AuthSignin = expressJWT({
  secret: JWT_SECRET,
  algorithms: ['HS256']
});

module.exports = {
  AuthSignin
}
