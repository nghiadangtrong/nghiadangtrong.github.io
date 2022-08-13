const { check } = require("express-validator");

const signupValidator = [
  check('name')
    .customSanitizer(value => value ? value.trim(): value)
    .not()
    .isEmpty()
    .withMessage('name require')
    .isLength({ max: 50 })
    .withMessage('name max length 50'),
  check('email')
    .customSanitizer(value => value.trim())
    .isEmail()
    .withMessage('Email is invalid'),
  check('password')
    .customSanitizer(value => value.trim())
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('Password min length 8')
    .isStrongPassword()
    .withMessage('Passowrd Not Strong')
]

const signinValidator = [
  check('email')
    .customSanitizer(value => value? value.trim(): value)
    .isEmail()
    .withMessage('Email is invalid'),
  check('password')
    .customSanitizer(value => value? value.trim(): value)
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage("Password min length 8")
    .isStrongPassword()
    .withMessage('Password not strong')
]

module.exports = {
  signupValidator, signinValidator,
}
