const { check } = require('express-validator')

const create = [
  check('name')
    .customSanitizer(value => value? value.trim(): value)
    .not()
    .isEmpty()
    .withMessage('name required')
    .isLength({ max: 255})
    .withMessage('name max length 255')
]

module.exports = {
  create,
  update: create,
}
