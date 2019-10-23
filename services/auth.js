const bcrypt = require('bcryptjs');
const randomBytes = require('crypto').randomBytes;
const UserModel = require('../models/user');

const createUserRecord = async (email, password, name) => {
    const salt = await bcrypt.genSalt(10);
    //Hash password
    const passwordHashed = await bcrypt.hash(password.toString(), salt);

    const userRecord = await UserModel.create({
        password: passwordHashed,
        email,
        name: name.toString()
    });

    return userRecord;
};

module.exports = {
    createUserRecord
};