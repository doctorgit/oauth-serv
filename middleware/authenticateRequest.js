const jwt = require('jsonwebtoken');
const secretToken = require('../config').secretToken;

module.exports = async (req, res, next) => {

    const token = req.header('x-auth-token');
    console.log('secretToken =', secretToken);

    if (!token) {
        return res.status(401).json({ msg: 'No token, auth denied' });
    }

    //Verify
    try {
        console.log('token, secretToken',token, secretToken);
        await jwt.verify(token, secretToken, (error, decoded) => {
            if (error) {
                console.log(error)
                res.status(401).json({ msg: 'Token is not valid' });
                return;
            }

            req.user = decoded.user;
            next();
        })
    } catch(err) {
        console.log('something went wrong with authenticate middleware');
        res.status(500).json({ msg: 'Server Error' });

    }
};