const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

// User model
const User = require('../models/user');
// Login page
router.get('/login', (req, res) => res.render('login'));
// Register page
router.get('/register', (req, res) => res.render('register'));
// Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

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
    // Validation passed
    User.findOne({ email })
        .then((user) => {
            if (user) {
                // User exists
                errors.push({ msg: 'Email is already registered' });
                res.render('register', { errors, ...req.body });
                return;
            }

            const newUser = new User({ name, email, password });

            //Hash password
            bcrypt.genSalt(10, (error, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                //Set password to hashed
                newUser.password = hash;
                //Save user
                newUser.save()
                    .then(() => {
                        req.flash('success_msg', 'You are registered now and can log in');
                        res.redirect('/users/login')
                    })
                    .catch(error => console.log(error))
                }));
        })
        .catch((error) => {
            console.log(error);
        });
});

// Login Handle

router.post('/login', (request, response, next) => {
     passport.authenticate('local', {
         successRedirect: '/dashboard',
         failureRedirect: '/users/login',
         failureFlash: true
     })(request, response, next);
});

module.exports = router;