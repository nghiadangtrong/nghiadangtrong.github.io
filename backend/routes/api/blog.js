const express = require('express');
const router = express.Router();
const BlogController = require('../../controllers/Blog');
const { AuthSignin } = require('../../middleware/auth');
const AuthUser = require('../../middleware/authUser');

router.get('/blogs', BlogController.list)
router.get('/blogs/:slug', BlogController.detail)
router.get('/blogs/related/:slug', BlogController.getRelated)
router.get('/blogs/photo/:slug', BlogController.getPhoto)

router.post('/blogs', AuthSignin, AuthUser, BlogController.create);
router.put('/blogs/:slug', AuthSignin, AuthUser, BlogController.update);
router.delete('/blogs/:slug', AuthSignin, AuthUser, BlogController.delete);

module.exports = router;
