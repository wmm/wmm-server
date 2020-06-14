const fs = require('fs');
const jwt = require('jsonwebtoken');

const configPath = './config/jwt.json';

if (!fs.existsSync(configPath)) {
    console.error('Failed to open', configPath)
    process.exit(1);
}

/** @type {{secret: string, algorithm: string, expireTime: string}} */
const jwtConf = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }));

module.exports = {

    /**
     * @param {string} userId
     * @param {jwt.SignCallback} callback
     */
    generateRefreshToken: function (userId, callback) {
        jwt.sign({ userId }, jwtConf.secret, { algorithm: jwtConf.algorithm }, callback)
    },

    /**
     * @param {string} userId
     * @param {jwt.SignCallback} callback
     */
    generateAccessToken: function (userId, callback) {
        jwt.sign({ userId }, jwtConf.secret, { algorithm: jwtConf.algorithm, expiresIn: jwtConf.expireTime }, callback)
    },

    /**
     * @param {string} token 
     * @param {jwt.VerifyCallback} callback 
     */
    validateToken: function (token, callback) {
        jwt.verify(token, jwtConf.secret, { algorithm: jwtConf.algorithm }, callback)
    },

    requireLogin: function (req, res, next) {
        let token = req.headers.authorization;
        if (!token) return res.status(401).json('Login required');
        
        token = token.split(' ')[1];
        module.exports.validateToken(token, (err, data) => {
            if (err) return next(err);

            if (!data.exp) return res.status(400).json('Access token required');

            req.user = data.userId;
            next();
        });
    }

}