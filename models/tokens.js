const mongoose = require('mongoose');
const UsersModel = require('./user');
const bcrypt = require('bcryptjs');
const TokenSchema = require('../schema/token');
const ClientSchema = require('../schema/client');

/**
 * Definitions
 */
mongoose.model('OAuthTokens', TokenSchema);
mongoose.model('OAuthClients', ClientSchema);

const TokensModel = mongoose.model('OAuthTokens');
const ClientsModel = mongoose.model('OAuthClients');

let loadExampleData = function() {
    const client1 = new ClientsModel({
        id: '1',
        clientId: 'Gallery App',
        clientSecret: 'secret77',
        grants: [
            'password',
            'refresh_token'
        ],
        redirectUris: []
    });

    client1.save(function(err, client) {
        if (err) {
            return console.error(err);
        }
        console.log('Created client', client);
    });
};

//loadExampleData();

// Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
const getAccessToken = (bearerToken) => TokensModel.findOne({ accessToken: bearerToken }).lean();

/*const getClient = async (clientId, clientSecret) => {

    const clientRecord = ClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret });
    if (!clientRecord) {
        throw new Error('Client not found')
    }

    c
    return clientRecord;
};*/

const getClient = function(clientId, clientSecret, callback) {

    ClientsModel.findOne({
        clientId: clientId,
        clientSecret: clientSecret
    }).lean().exec((function(callback, err, client) {

        if (!client) {
            console.error('Client not found');
        }

        callback(err, client);
    }).bind(null, callback));
};


const getRefreshToken = (refreshToken) => TokensModel.findOne({ refreshToken: refreshToken }).lean();

const getUser = async (email, password) => {
    const userRecord = await UsersModel.findOne({ email });
    if (!userRecord) {
        throw new Error('User not found')
    }
    // Match password
    let correctPassword = await bcrypt.compare(password, userRecord.password)
        .then((isMached) => (isMached))
        .catch((error) => { console.log(error); return false; });

    if (!correctPassword) {
        throw new Error('Incorrect password')
    }

    return userRecord;
};

/*const saveToken = (token, client, user) => {
    console.log('saveToken', token, client, user);
    const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
    } = token;

    const newToken = { ...token,
        client: { id: client.clientId },
        user: { username: '11111' }
    };

    const tokenRecord = new TokensModel(newToken);
    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise((resolve,reject) => {
        tokenRecord.save((err,data) => {
            if( err ) {
                reject( err );
            } else {
                resolve(data);
            }
        });
    }).then((saveResult) => {
        // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
        saveResult = saveResult && typeof saveResult === 'object' ? saveResult.toJSON() : saveResult;

        // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
        let data = {};
        for(const prop in saveResult ) data[prop] = saveResult[prop];

        // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
        data.client = data.clientId;
        data.user = data.userId;

        return data;
    });
};*/

const saveToken = (token, client, user, callback) => {
    const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt
    } = token;

    const tokenInstance = new TokensModel({
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        user,
        client
    });

    tokenInstance.save((err, token) => {
        if (!token) {
            console.error('Token not saved');
        } else {
            token = token.toObject();
            delete token._id;
            delete token.__v;
        }

        callback(err, token)
    });
};

module.exports = {
    getAccessToken,
    getClient,
    saveToken,
    getUser,
    getRefreshToken,
    TokensModel
};