const jwt = require('../jwt');

module.exports = {

    requireLogin: function (req, res, next) {
        let token = req.headers.authorization;
        if (!token) return res.status(401).json('Login required');
        
        token = token.split(' ')[1];
        jwt.validateAccessToken(token, (err, data) => {
            if (err) return next(err);

            req.user = {
                id: data.userId,
                username: data.username
            };
            next();
        });
    },

    optionalLogin: function (req, res, next) {
        let token = req.headers.authorization;
        if (!token) return next();
        
        token = token.split(' ')[1];
        jwt.validateAccessToken(token, (err, data) => {
            if (err) return next(err);

            req.user = {
                id: data.userId,
                username: data.username
            };
            next();
        });
    }

}