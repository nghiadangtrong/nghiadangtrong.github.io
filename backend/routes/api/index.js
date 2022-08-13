const router = require('express').Router();

const BlogRoutes = require('./blog');
const AuthRoutes = require('./auth');
const UserRoutes = require('./user');
const CategoryRoutes = require('./category');
const TagRoutes = require('./tag');

//const { AuthSignin } = require('../../middleware/auth')
//const AuthAdmin = require('../../middleware/authAdmin');

router.use(BlogRoutes);
router.use(AuthRoutes);
router.use(UserRoutes);
router.use(CategoryRoutes);
router.use(TagRoutes);

module.exports = router;
