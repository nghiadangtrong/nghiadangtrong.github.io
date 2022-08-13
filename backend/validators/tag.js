const { check } = require('express-validator');

const create = [
  check('name')
    .customSanitizer(value => value ? value.trim() : value)
    .not()
    .isEmpty()
    .withMessage('name is required')
    .isLength({ max: 50 })
    .withMessage('name max length 50'),
]

module.exports = {
  create,
  update: create,
}
