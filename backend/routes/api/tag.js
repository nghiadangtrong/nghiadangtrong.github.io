const express = require('express');
const router = express.Router();

const TagController = require('../../controllers/Tag');

const { AuthSignin } = require('../../middleware/auth');
const AuthAdmin = require('../../middleware/authAdmin');

const { runValidation } = require('../../validators');
const TagValidator = require('../../validators/tag')

router.get('/tags', TagController.list);
router.get('/tags/:slug', TagController.detail);

router.post('/tag', AuthSignin, AuthAdmin, TagValidator.create, runValidation, TagController.create)
router.put('/tag/:slug', AuthSignin, AuthAdmin, TagValidator.update, runValidation, TagController.update)
router.delete('/tag/:slug', AuthSignin, AuthAdmin, TagController.delete);

module.exports = router;

