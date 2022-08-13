const express = require('express');
const router = express.Router();
const { signup, signin, signout } = require('../../controllers/Auth');

const { signupValidator, signinValidator } = require("../../validators/auth")
const { runValidation } = require("../../validators")
//const { AuthSignin } = require('../../middleware/auth')

router.post('/signup', signupValidator, runValidation, signup);
router.post('/signin', signinValidator, runValidation, signin)
router.post('/signout', runValidation, signout)

module.exports = router;
