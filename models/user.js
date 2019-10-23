const mongoose = require('mongoose');
const UserSchema = require('../schema/user');

const User = mongoose.model('User', UserSchema);

module.exports = User;