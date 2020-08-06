const db = require('../database');
const jwt = require('../jwt');
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
            return res.status(400).json('Invalid username');
        }
        if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name)) {
            return res.status(400).json('Invalid name');
        }
        if (!/^((?!.*\.\.)(?!\.)(?!.*\.@)([a-zA-Z\d\.\+\_$#!&%?-]+)@(((?!-)(?!.*-\.)([a-zA-Z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?)|(\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\])))$/.test(email)) {
            return res.status(400).json('Invalid email');
        }
        if (!/^[\w.#$%&@\- ]{6,}$/.test(password)) {
            return res.status(400).json('Invalid password');
        }

        const query = 'SELECT id FROM Users WHERE username = ?';
        const inserts = [username];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            if (results[0]) return res.status(400).json('Username taken');

            bcrypt.hash(password, 10, (err, pw_hash) => {
                if (err) return next(err);

                const query = 'INSERT INTO Users (username, name, email, password) VALUES (?,?,?,?)';
                const inserts = [username, name, email, pw_hash];

                db.query(query, inserts, (err) => {
                    if (err) return next(err);
                
                    return res.status(201).json('Account created');
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

        const query = 'SELECT id, username, password FROM Users WHERE username = ?';
        const inserts = [username];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const result = results[0];
            if (!result) return res.status(400).json('Login data invalid');

            const userId = result.id;
            const username = result.username;
            const userPass = result.password;

            bcrypt.compare(password, userPass, (err, succ) => {
                if (err) return next(err);

                if (!succ) return res.status(400).json('Login data invalid');

                jwt.generateRefreshToken(userId, username, (err, token) => {
                    if (err) return next(err);

                    const query = 'INSERT INTO Tokens (user_id, token) VALUES (?,?)';
                    const inserts = [userId, token];
            
                    db.query(query, inserts, (err) => {
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
        const refresh_token = req.body.refresh_token;
        if (!refresh_token) {
            return res.status(400).json('Refresh token required');
        }

        jwt.validateRefreshToken(refresh_token, (err, data) => {
            if (err) return next(err);

            const query = 'SELECT user_id FROM Tokens WHERE token = ?';
            const inserts = [refresh_token];

            db.query(query, inserts, (err, results) => {
                if (err) return next(err);

                const result = results[0];
                if (!result || result.user_id != data.userId) {
                    return res.status(400).json('Token is no longer valid');
                }

                jwt.generateAccessToken(data.userId, data.username, (err, token) => {
                    if (err) return next(err);
    
                    return res.status(200).json({
                        access_token: token
                    });
                });
            });

        });
    },

    deleteRefreshToken: function (req, res, next) {
        const refresh_token = req.body.refresh_token;
        if (!refresh_token) {
            return res.status(400).json('Refresh token missing');
        }

        jwt.validateRefreshToken(refresh_token, (err, data) => {
            if (err) return next(err);

            if (data.userId !== req.user.id) return res.status(403).json('You do not own this token');

            const query = 'DELETE FROM Tokens WHERE token = ?';
            const inserts = [refresh_token];

            db.query(query, inserts, err => {
                if (err) return next(err);

                return res.status(200).json('Token deleted');
            });
        });
    },

    profile: function (req, res, next) {
        const self = req.user.username;
        const username = req.params.username;
        if (!username) {
            return res.status(400).json('Username missing');
        }

        const query = 'SELECT username, name, total_lent, total_borrowed, current_lent, current_borrowed FROM Users WHERE username = ?';
        const inserts = [username];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const ret = results[0];
            if (!ret) return res.status(404).json('User not found');

            if (!self || self == ret.username) return res.status(200).json(ret);

            const query = 'SELECT user1, amount, status FROM PopulatedRelations WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)';
            const inserts = [self, username, username, self];
    
            db.query(query, inserts, (err, results) => {
                if (err) return next(err);

                const result = results[0];
                let obj;
                if (!result) obj = { status: 0, amount: 0 };
                else {
                    obj = {
                        status: result.user1 == self ? result.status : ((result.status&1)<<1)|((result.status&2)>>1),
                        amount: result.user1 == self ? result.amount : -result.amount
                    };
                }
    
                return res.status(200).json(Object.assign(ret, { relation: obj }));
            });
        });
    },

    profileSelf: function (req, res, next) {
        const userId = req.user.id;

        const query = 'SELECT username, name, email, total_lent, total_borrowed, current_lent, current_borrowed FROM Users WHERE id = ?';
        const inserts = [userId];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const result = results[0];
            if (!result) return next(new Error('User not found with ID'));

            return res.status(200).json(result);
        });
    },

    search: function (req, res, next) {
        let phrase = req.params.phrase;
        if (!phrase) {
            return res.status(400).json('Phrase missing');
        }

        phrase = `%${phrase}%`;
        const query = 'SELECT username FROM Users WHERE (username LIKE ?) OR (name LIKE ?)'
        const inserts = [phrase, phrase];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            return res.status(200).json(results.map(u => u.username));
        });
    }

}