const express = require('express');
const router = express.Router();
const loginRoute = require('./login');
const registerRoute = require('./register');
const refreshRoute = require('./refresh');


//Routes
router.use('/register', registerRoute);
router.use('/login', loginRoute);
router.use('/refresh', refreshRoute);


module.exports = router;