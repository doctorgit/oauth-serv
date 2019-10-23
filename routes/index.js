const express = require('express');

const router = express.Router();

// Login
router.get('/',  (req, res) => res.send('welcome'));

module.exports = [
    ['/', router],
    ['/api/auth', require('./api/auth')],
    ['/login', require('./login')],
    ['/register', require('./register')],

];