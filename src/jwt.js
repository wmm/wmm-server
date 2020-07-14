const jwt = require('jsonwebtoken');

const jwtConf = require('./config/jwt.json');

module.exports = {

    /**
     * @param {String} userId
     * @param {String} username
     * @param {jwt.SignCallback} callback
     */
    generateRefreshToken: function (userId, username, callback) {
        jwt.sign({ userId, username }, jwtConf.secret, { algorithm: jwtConf.algorithm }, callback)
    },

    /**
     * @param {String} userId
     * @param {String} username
     * @param {jwt.SignCallback} callback
     */
    generateAccessToken: function (userId, username, callback) {
        jwt.sign({ userId, username }, jwtConf.secret, { algorithm: jwtConf.algorithm, expiresIn: jwtConf.expireTime }, callback)
    },

    /**
     * @param {String} token 
     * @param {jwt.VerifyCallback} callback 
     */
    validateRefreshToken: function (token, callback) {
        jwt.verify(token, jwtConf.secret, { algorithm: jwtConf.algorithm, ignoreExpiration: true }, (err, data) => {
            if (err) {
                err.status = 401;
                return callback(err);
            }

            if (data.exp) {
                const err = new Error('Token is not a refresh token');
                err.name = 'TokenInvalidError';
                err.status = 401;
                return callback(err);
            }

            callback(null, data);
        });
    },

    /**
     * @param {String} token 
     * @param {jwt.VerifyCallback} callback 
     */
    validateAccessToken: function (token, callback) {
        jwt.verify(token, jwtConf.secret, { algorithm: jwtConf.algorithm }, (err, data) => {
            if (err) {
                err.status = 401;
                return callback(err);
            }

            if (!data.exp) {
                const err = new Error('Token is not a refresh token');
                err.name = 'TokenInvalidError';
                err.status = 401;
                return callback(err);
            }

            callback(null, data);
        });
    },

}