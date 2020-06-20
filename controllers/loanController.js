const db = require('../connection');

module.exports = {

    getLoans: function (req, res, next) {
        const offset = req.params.start || 0;
        const limit = req.params.count || 10;
        const username = req.user.username;

        db.query('SELECT * FROM PopulatedLoans WHERE sender = ? OR reciever = ? ORDER BY created DESC LIMIT ? OFFSET ?', [username, username, limit, offset], (err, results) => {
            if (err) return next(err);

            return res.status(200).json(results);
        });
    },

    create: function (req, res, next) {
        const sender = req.body.sender;
        const reciever = req.body.reciever;
        const amount_s = req.body.amount;
        if (!sender || !reciever || !amount_s) {
            return res.status(400).json('Missing field(s): sender, reciever and amount required');
        }

        const amount = parseFloat(amount_s);
        if (!amount || amount <= 0) return res.status(400).json('Invalid field: amount')

        const userId = req.user.id;
        
        // TODO: Avoid callback hell
        db.query('SELECT id FROM Users WHERE username = ?', [sender], (err, results) => {
            if (err) return next(err);
            if (results.length === 0) return res.status(400).json('Sender does not exist');

            const sender_id = results[0].id;

            db.query('SELECT id FROM Users WHERE username = ?', [reciever], (err, results) => {
                if (err) return next(err);
                if (results.length === 0) return res.status(400).json('Reciever does not exist');
    
                const reciever_id = results[0].id;

                if (sender_id !== userId && reciever_id !== userId) return res.status(400).json('Cannot create loans between other people');

                if (sender_id === reciever_id) return res.status(400).json('Cannot create a loan with yourself');

                db.query('INSERT INTO Loans (sender_id, reciever_id, creator_id, amount) VALUES (?,?,?,?)', [sender_id, reciever_id, userId, amount], (err) => {
                    if (err) return next(err);

                    return res.status(201).json('Loan created');
                });
            });
        });
    },

    confirm: function (req, res, next) {
        const userId = req.user.id;
        const loanId = req.params.loanId;

        db.query('SELECT * FROM Loans WHERE id = ?', [loanId], (err, results) => {
            if (err) return next(err);

            if (results.length === 0) return res.status(400).json('Loan does not exist');

            const loan = results[0];
            if (loan.sender_id != userId && loan.reciever_id != userId) {
                return res.status(403).json('You can not access other peoples loans');
            }

            if (loan.creator_id == userId) return res.status(400).json('You cannot confirm a loan you created');

            if (loan.confirmed) return res.status(400).json('Loan already confirmed');

            db.query('UPDATE Loans SET confirmed = CURRENT_TIMESTAMP WHERE id = ?', [loanId], (err) => {
                if (err) return next(err);

                return res.status(200).json('Loan confirmed');
            });
        });
    },

}