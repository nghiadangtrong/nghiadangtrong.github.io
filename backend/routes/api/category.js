const express = require('express');
const router = express.Router();

const CategoryController = require('../../controllers/Category');

const CategoryValidator = require('../../validators/category');
const { runValidation } = require('../../validators/index');

const { AuthSignin } = require('../../middleware/auth')
const AuthAdmin = require('../../middleware/authAdmin');

// add middleware
router.get('/categories', CategoryController.list);
router.get('/categories/:slug', CategoryController.detail)

router.post('/categories', AuthSignin, AuthAdmin, CategoryValidator.create, runValidation, CategoryController.create)
router.put('/categories/:slug', AuthSignin, AuthAdmin, CategoryValidator.update, runValidation, CategoryController.update)
router.delete('/categories/:slug', AuthSignin, AuthAdmin, CategoryController.delete)

module.exports = router;
//module.exports = express.Router().use(AuthSignin, AuthAdmin, router); // other write
