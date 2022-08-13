const express = require('express');
const router = express.Router();

const { AuthSignin } = require('../../middleware/auth');
const AuthUser = require('../../middleware/authUser');

const UserController = require('../../controllers/User');

router.get('/user/profile', AuthSignin, AuthUser, UserController.profile);
router.put('/user/update-profile/:username', AuthSignin, AuthUser, UserController.updateProfile);
router.put('/user/update-password', AuthSignin, AuthUser, UserController.updatePassword);
router.get('/user/public-profile/:username', UserController.publicProfile);
router.get('/user/photo/:username')

module.exports = router;
