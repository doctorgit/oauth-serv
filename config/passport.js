const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/user');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({ email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (error, isMatch)=> {
                        if (error) throw error;

                        return isMatch ? done(null, user)
                            : done(null, false, { message: 'Password incorrect' })
                    });
                })
                .catch((error) => console.log(error))
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));

    // Calls dane as callback with error and user arguments
    passport.deserializeUser((id, done) => User.findById(id, done));
};