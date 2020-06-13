const db = require('../connection');
const crypto = require('crypto');

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
        
        db.query('SELECT * FROM Users WHERE username = ?', [username], (err, /** @type array */ results) => {
            if (err) return next(err);

            if (results.length > 0) {
                return res.status(400).json('Username taken')
            }

            const pw_hash = hashPassword(password);

            db.query('INSERT INTO Users (username, name, email, password) VALUES (?,?,?,?)', [username, name, email, pw_hash], (err) => {
                if (err) return next(err);

                return res.status(201).json();
            })
        });
    },

    login: function (req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            return res.status(400).json('Empty field(s): username and password required');
        }

        return res.status(501).json();
    },

    profile: function (req, res, next) {
        return res.status(501).json();
    },

    profileSelf: function (req, res, next) {
        return res.status(501).json();
    }

}

/** @param {string} password */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}