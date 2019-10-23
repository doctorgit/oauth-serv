const express = require('express');
const url = require('url');
const OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

const router = express.Router();

// Login page
router.get('/', (req, res) => {
    console.log('login');
    res.render('login')
});

router.post('/', async (req, res) => {
    console.log('login post');
    const { query } = url.parse(req.headers.referer, true);
    req.headers['Authorization'] = query.a;

    const request = new Request(req);
    const response = new Response(res);

    req.app.oauth.token(request, response)
        .then((token) => {
            // The request was successfully authenticated.
            const str = token.accessToken.toString();
            res.render('complete', { data: str });
        })
        .catch((err) => {
            console.log(err.code, err.message, err); // The request failed authentication.
            res.render('login');
        });
});

// Log out handle
router.get('/logout', (request, response) => {
    request.logout();
    //request.flash('success_msg', 'You are logged out');
    response.redirect('/login');
});

module.exports = router;