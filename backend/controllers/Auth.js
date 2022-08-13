const UserModel = require('../models/user');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/auth');

class UserController {

  async signup(req, res) {
    try {
      let { name, email, password } = req.body;
      let userExist = await UserModel.findOne({ email });
      if (userExist) {
        throw new Error('Email is exists');
      }
      let username = nanoid();
      let profile = `/profile/${username}`;
      let data = { username, name, email, password, profile };
      let user = new UserModel(data);
      await user.save();
      return res.json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async signin(req, res) {
    try {
      let { email, password } = req.body;
      let user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("email not found");
      }
      let passwordIncorrect = user.authenticate(password);
      if (!passwordIncorrect) {
        throw new Error('Password incorrect');
      }

      // make token
      let token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });
      let { _id, username, name, profile, role } = user;

      // set token to cookie
      res.cookie('token', token, { expiresIn: '100s' });

      return res.json({
        token,
        user: { _id, username, email, name, profile, role }
      })

    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: error.message })
    }
  }

  async signout(req, res) {
    try {
      // res.clearCookie('token');
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      console.log('[+] Ip client: ', ip)
      return res.json({ success: true })
    } catch (e) {
      return res.status(400).json({ error: error.message })
    }
  }

}


module.exports = new UserController();
