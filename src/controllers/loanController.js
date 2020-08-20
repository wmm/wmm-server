const db = require('../database');

module.exports = {

    getLoans: function (req, res, next) {
        const offset = parseInt(req.query.start);
        const limit = parseInt(req.query.count) || 10;
        const username = req.user.username;

        let inserts = [username, username, limit];
        let qOffset = '';
        if (offset) {
            qOffset = 'AND id < ?';
            inserts.splice(2, 0, offset);
        }
        const query = `SELECT * FROM PopulatedLoans WHERE (sender = ? OR reciever = ?) ${qOffset} ORDER BY created DESC LIMIT ?`;

        db.query(query, inserts, (err, /** @type {Array} */ results) => {
            if (err) return next(err);

            return res.status(200).json(results);
        });
    },

    create: function (req, res, next) {
        const self = req.user;
        const title = req.body.title;
        const other = req.body.user;
        const amount_s = req.body.amount;
        if (!other || !amount_s) {
            return res.status(400).json('Missing field(s): user and amount required');
        }

        let amount = parseFloat(amount_s);
        if (!amount || amount.toFixed(2) == 0)
            return res.status(400).json('Invalid field: amount');
        amount = amount.toFixed(2);

        if (other === self.username) return res.status(400).json('Cannot create a loan with yourself');
        
        const query = 'SELECT id FROM Users WHERE username = ?';
        const inserts = [other];

        db.query(query, inserts, (err, /** @type {Array} */ results) => {
            if (err) return next(err);

            if (results.length == 0) return res.status(400).json('User does not exist');

            const other_id = results[0].id;

            const query = 'INSERT INTO Loans (title, sender_id, reciever_id, creator_id, amount) VALUES (?,?,?,?,?)';
            let inserts;
            if (amount > 0) inserts = [title, self.id, other_id, self.id, amount];
            else inserts = [title, other_id, self.id, self.id, -amount];

            db.query(query, inserts, (err) => {
                if (err) return next(err);

                return res.status(201).json('Loan created');
            });
        });
    },

    get: function (req, res, next) {
        const username = req.user.username;
        const loanId = req.params.loanId;

        const query = 'SELECT * FROM PopulatedLoans WHERE id = ?';
        const inserts = [loanId];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const loan = results[0];
            if (!loan) return res.status(400).json('Loan does not exist');

            if (loan.sender != username && loan.reciever != username) {
                return res.status(403).json('You can not access other peoples loans');
            }

            return res.status(200).json(loan);
        });
    },

    confirm: function (req, res, next) {
        const userId = req.user.id;
        const loanId = req.params.loanId;

        const query = 'SELECT * FROM Loans WHERE id = ?';
        const inserts = [loanId];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const loan = results[0];
            if (!loan) return res.status(400).json('Loan does not exist');

            if (loan.sender_id != userId && loan.reciever_id != userId) {
                return res.status(403).json('You can not access other peoples loans');
            }

            if (loan.creator_id == userId) return res.status(400).json('You cannot confirm a loan you created');

            if (loan.status != 0) return res.status(400).json(`Loan already ${loan.status == 1 ? 'confirmed' : 'rejected'}`);

            const query = 'UPDATE Loans SET status = 1 WHERE id = ?';
            const inserts = [loanId];
    
            db.query(query, inserts, (err) => {
                if (err) return next(err);

                return res.status(200).json('Loan confirmed');
            });
        });
    },

    reject: function (req, res, next) {
        const userId = req.user.id;
        const loanId = req.params.loanId;

        const query = 'SELECT * FROM Loans WHERE id = ?';
        const inserts = [loanId];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const loan = results[0];
            if (!loan) return res.status(400).json('Loan does not exist');

            if (loan.sender_id != userId && loan.reciever_id != userId) {
                return res.status(403).json('You can not access other peoples loans');
            }

            if (loan.status != 0) return res.status(400).json(`Loan already ${loan.status == 1 ? 'confirmed' : 'rejected'}`);

            const query = 'UPDATE Loans SET status = -1 WHERE id = ?';
            const inserts = [loanId];
    
            db.query(query, inserts, (err) => {
                if (err) return next(err);

                return res.status(200).json('Loan rejected');
            });
        });
    },

}