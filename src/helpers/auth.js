const jwt = require('jsonwebtoken');

/** @type {{secret: string, algorithm: string, expireTime: string}} */
const jwtConf = require('../config/jwt.json');

module.exports = {

    /**
     * @param {string} userId
     * @param {string} username
     * @param {jwt.SignCallback} callback
     */
    generateRefreshToken: function (userId, username, callback) {
        jwt.sign({ userId, username }, jwtConf.secret, { algorithm: jwtConf.algorithm }, callback)
    },

    /**
     * @param {string} userId
     * @param {string} username
     * @param {jwt.SignCallback} callback
     */
    generateAccessToken: function (userId, username, callback) {
        jwt.sign({ userId, username }, jwtConf.secret, { algorithm: jwtConf.algorithm, expiresIn: jwtConf.expireTime }, callback)
    },

    /**
     * @param {string} token 
     * @param {jwt.VerifyCallback} callback 
     */
    validateRefreshToken: function (token, callback) {
        jwt.verify(token, jwtConf.secret, { algorithm: jwtConf.algorithm, ignoreExpiration: true }, (err, data) => {
            if (err) return callback(err);

            if (data.exp) {
                const err = new Error('Token is not a refresh token');
                err.name = 'TokenInvalidError';
                err.status = 400;
                return callback(err);
            }

            callback(null, data);
        });
    },

    /**
     * @param {string} token 
     * @param {jwt.VerifyCallback} callback 
     */
    validateAccessToken: function (token, callback) {
        jwt.verify(token, jwtConf.secret, { algorithm: jwtConf.algorithm }, (err, data) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    err.status = 400;
                    err.message = 'Access token expired';
                }
                else if (err.name === 'JsonWebTokenError') {
                    err.status = 400;
                    err.message = 'Invaild token';
                }

                return callback(err);
            }

            if (!data.exp) {
                const err = new Error('Token is not a refresh token');
                err.name = 'TokenInvalidError';
                err.status = 400;
                return callback(err);
            }

            callback(null, data);
        });
    },

    requireLogin: function (req, res, next) {
        let token = req.headers.authorization;
        if (!token) return res.status(401).json('Login required');
        
        token = token.split(' ')[1];
        module.exports.validateAccessToken(token, (err, data) => {
            if (err) return next(err);

            req.user = {
                id: data.userId,
                username: data.username
            };
            next();
        });
    }

}