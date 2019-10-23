const express = require('express'),
    OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

const { TokensModel } = require('../models/tokens');

const router = express.Router();

const authenticateRequest = (req, res, next) => {
    const request = new Request(req);
    const response = new Response(res);
    return req.app.oauth.authenticate(request, response)
        .then((token) => { res.locals.token = token.accessToken ;next(); })
        .catch((err) => { console.log(err); res.status(err.code || 500).json(err) });
};

router.get('/auth', (req, res) => {
    const request = new Request(req);
    const response = new Response(res);

    console.log('/auth')
    req.app.oauth.authenticate(request, response)
        .then(async (token) => {
            const { user: userRecord } = await TokensModel.findOne({ accessToken: token.accessToken });
            if (!userRecord) {
                throw new Error('User not found')
            }

            await res.json({ user: { email: userRecord.email, name: userRecord.name }, token: token.accessToken});
        })
        .catch((err) => { console.log(err); res.status(err.code || 500).json(err) });
});

router.get('/', authenticateRequest, (req, res) => {
    res.send('Congratulations, you are in a secret area!');
});

module.exports = router;