const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * @desc Authorization middleware which takes in the jwt token 
 * given by the user and verifies it
 */
const authorize = (req, res, next) => {
    // Getting the token from header
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).json({ msg: 'Token not provided, authorization failed' });
    }

    // Verifying the token
    try {
        const decodedToken = jwt.verify(token, config.get('jwtSecret'));

        // Setting the decoded value to the request
        req.user = decodedToken.user;
        next();
    } catch (err) {
        res.status(401).json({ 'msg': 'Invalid token' });
    }
}

module.exports = authorize;
