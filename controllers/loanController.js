const db = require('../connection');

module.exports = {

    getLoans: function (req, res, next) {
        return res.status(501).json();
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

        const userId = req.userId;
        
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

                    return res.status(201).json();
                });
            });
        });

        
    }

}