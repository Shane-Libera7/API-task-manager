const express = require('express');
const router = express.Router();
const loginRoute = require('./login');
const registerRoute = require('./register');
const refreshRoute = require('./refresh');
const logoutRoute = require('./logout');


//Routes
router.use('/register', registerRoute);
router.use('/login', loginRoute);
router.use('/refresh', refreshRoute);
router.use('/logout', logoutRoute);


module.exports = router;