module.exports = {

    friends: function (req, res, next) {
        const username = req.user.username;

        const query = 'SELECT IF(user1=?, user2, user1) AS username FROM PopulatedRelations WHERE (user1=? OR user2=?) AND status = 3';
        const inserts = [username, username, username];

        db.query(query, inserts, (err, /** @type {Array} */ results) => {
            if (err) return next(err);

            return res.status(200).json(results.map(f => f.username));
        });
    },

    requests: function (req, res, next) {
        const username = req.user.username;

        const query = 'SELECT IF(user1=?, user2, user1) AS username FROM PopulatedRelations WHERE (user1=? AND status = 2) OR (user2=? AND status = 1)';
        const inserts = [username, username, username];

        db.query(query, inserts, (err, /** @type {Array} */ results) => {
            if (err) return next(err);

            return res.status(200).json(results.map(f => f.username));
        });
    },

    add: function (req, res, next) {
        const self = req.user.username;
        const username = req.params.username;

        const query = 'SELECT id, user1, status FROM PopulatedRelations WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)';
        const inserts = [self, username, self, self, username];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const result = results[0];
            if (!result) {
                const query = 'INSERT INTO Relations (user1_id, user2_id, status) VALUES ((SELECT id FROM Users WHERE username = ?), (SELECT id FROM Users WHERE username = ?), 1)';
                const inserts = [self, username];

                db.query(query, inserts, (err, results) => {
                    if (err) return next(err);
        
                    // TODO: remove
                    console.log(results);
                    return res.status(200).json('Friend request sent');
                });
            }

            const status = result.user1 == self ? result.status : ((result.status&1)<<1)|((result.status&2)>>1);
            if (status == 3) return res.status(200).status('You are already friends');
            if (status == 1) return res.status(200).status('Friend request already sent');

            const query = 'UPDATE Relations SET status = status | ? WHERE id = ?';
            const inserts = [(result.user1 == self ? 1 : 2), result.id];

            db.query(query, inserts, (err, results) => {
                if (err) return next(err);
    
                // TODO: remove
                console.log(results);
                return res.status(200).json(status == 0 ? 'Friend request sent' : 'Friend added');
            });
        });
    },

    remove: function (req, res, next) {
        const self = req.user.username;
        const username = req.params.username;

        const query = 'SELECT id, user1, status FROM PopulatedRelations WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)';
        const inserts = [username, self, self, username];

        db.query(query, inserts, (err, results) => {
            if (err) return next(err);

            const result = results[0];
            if (!result || result.status == 0) return res.status(400).json('You are not friends');
            const status = result.user1 == self ? result.status : ((result.status&1)<<1)|((result.status&2)>>1);

            const query = 'UPDATE Relations SET status = 0 WHERE id = ?';
            const inserts = [result.id];

            db.query(query, inserts, err => {
                if (err) return next(err);
    
                let message;
                switch (status) {
                    case 1:
                        message = 'Friend request canceled';
                        break;
                    case 2:
                        message = 'Friend request rejected';
                        break;
                    case 3:
                        message = 'Friend removed';
                        break;
                }
                return res.status(200).json(message);
            });
        });
    }

}