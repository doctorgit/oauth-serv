const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    accessToken: String,
    accessTokenExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    client: Object,
    user: Object
});

//TokenSchema.index({ "refreshTokenExpiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = TokenSchema;