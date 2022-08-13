const mongoose = require("mongoose");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    max: 50,
    index: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
  },
  profile: {
    type: String,
    required: true,
  },
  hash_password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentType: String,
    name: String
  },
  role: {
    type: Number,
    default: 0, //
  },
  resetPasswordLink: {
    type: String,
  }
}, { timestamps: true })

// ---------- Customer Schema ----------
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hash_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
  encryptPassword: function (password) {
    try {
      return crypto.createHmac('sha256', this.salt) // or sha1
        .update(password)
        .digest('hex');
    } catch(error) {
      return '';
    }
  },
  authenticate: function (planText) {
    return this.encryptPassword(planText) === this.hash_password;
  },
}

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel;
