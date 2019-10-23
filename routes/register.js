const express = require('express');
const { createUserRecord } = require('../services/auth');
const jwt = require('jsonwebtoken');
const { secretToken, expiresIn } = require('../config');

const router = express.Router();

// Register page
router.get('/', (req, res) => res.render('register'));

// Register request
router.post('/', async (req, res) => {


    const { name, email, password, password2 } = req.body;
    let errors = [];
    console.log('register', name, email, password, password2);
    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    // Check password length
    if (password.length < 6 ) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length) {
        res.render('register', { errors, ...req.body });
        return;
    }

    try {
        const userRecord = await createUserRecord(email, password, name);

        await userRecord.save();

        const payload = { user: { id: userRecord.id } };
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWRhY2MwZDBhY2EyMWQxN2RlN2NlMjc0In0sImlhdCI6MTU3MTYwMjY0MCwiZXhwIjoxNTcxNjM4NjQwfQ.ZS4NTcRwz2cD4kVdZcA5uOqnQs-lyycrPQ7qfRLWOS0

        jwt.sign(
            payload,
            secretToken,
            { expiresIn },
            (err, token) => {
                if (err) {
                    throw err;
                }

                res.status(200).json({ token });
            }
        );
    } catch (e) {
        return res.status(500).json(e);
    }
});

module.exports = router;