const db = require('../connection');
const auth = require('../helpers/auth');
const bcrypt = require('bcrypt');

module.exports = {

    register: function (req, res, next) {
        const username = req.body.username;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        if (!username || !name || !email || !password) {
            return res.status(400).json('Empty field(s): username, name, email and password required');
        }

        if (!/^[\w.]{5,20}$/.test(username)) {
            return res.status(400).json('Username format: /^[\\w.]{5,20}$/');
        }
        if (!/^[a-zA-Z][a-zA-Z ]*$/.test(name)) {
            return res.status(400).json('Name format: /^[a-zA-Z][a-zA-Z ]*$/');
        }
        if (!/^((?!.*\.\.)(?!\.)(?!.*\.@)([a-zA-Z\d\.\+\_$#!&%?-]+)@(((?!-)(?!.*-\.)([a-zA-Z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?)|(\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\])))$/.test(email)) {
            return res.status(400).json('Invalid email');
        }
        if (!/^[\w.#$%&@\- ]{6,}$/.test(password)) {
            return res.status(400).json('Password format: /^[\\w.#$%&@\- ]{6,}$/');
        }

        db.query('SELECT id FROM Users WHERE username = ?', [username], (err, /** @type array */ results) => {
            if (err) return next(err);

            if (results.length > 0) {
                return res.status(400).json('Username taken')
            }

            bcrypt.hash(password, 10, (err, pw_hash) => {
                if (err) return next(err);

                db.query('INSERT INTO Users (username, name, email, password) VALUES (?,?,?,?)', [username, name, email, pw_hash], (err) => {
                    if (err) return next(err);
                
                    return res.status(201).json();
                })
            });
        });
    },

    login: function (req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            return res.status(400).json('Empty field(s): username and password required');
        }

        db.query('SELECT id, password FROM Users WHERE username = ?', [username], (err, /** @type array */ results) => {
            if (err) return next(err);

            if (results.length === 0) return res.status(400).json('Login data invalid');

            const userId = results[0].id;
            const userPass = results[0].password;

            bcrypt.compare(password, userPass, (err, succ) => {
                if (err) return next(err);

                if (!succ) return res.status(400).json('Login data invalid');

                auth.generateRefreshToken(userId, (err, token) => {
                    if (err) return next(err);

                    db.query('INSERT INTO Tokens (user_id, token) VALUES (?,?)', [userId, token], (err) => {
                        if (err) return next(err);

                        return res.status(200).json({
                            refresh_token: token
                        });
                    });
                });
            });
        });
    },

    getAccessToken: function (req, res, next) {
        const token = req.body.refresh_token;
        if (!token) {
            return res.status(400).json('Refresh token required');
        }

        auth.validateToken(token, (err, data) => {
            if (err) return next(err);

            auth.generateAccessToken(data.userId, (err, token) => {
                if (err) return next(err);

                return res.status(200).json({
                    access_token: token
                });
            });
        });
    },

    deleteRefreshToken: function (req, res, next) {
        return res.status(501).json();
    },

    profile: function (req, res, next) {
        return res.status(501).json();
    },

    profileSelf: function (req, res, next) {
        return res.status(501).json();
    }

}