const express = require('express');
const router = express.Router();
const loginRoute = require('./login');
const registerRoute = require('./register');



//Routes
router.use('/register', registerRoute);
router.use('/login', loginRoute);


module.exports = router;