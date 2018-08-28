const express = require('express');
const UserControllers = require('../controllers/users')
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post('/signup', UserControllers.createUser);
router.get('/:id', checkAuth, UserControllers.getUser);
router.put( '/:id', checkAuth, UserControllers.userUpdate);
router.post('/login', UserControllers.userLogin);

module.exports = router;
