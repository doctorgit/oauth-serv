const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticateRequest = require('../../middleware/authenticateRequest');

/**
 * @route    GET api/auth
 * @desc     Test route
 * @access   Public
 */

router.get('/', authenticateRequest, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;