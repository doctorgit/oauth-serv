const express = require('express');

const router = express.Router();

// Auth
router.get('/auth', require('./auth'));

module.exports = router;