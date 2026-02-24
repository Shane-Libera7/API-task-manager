const express = require('express');
const router = express.Router();

const registerRoute = require('./register');

router.use('/register', registerRoute);



module.exports = router;