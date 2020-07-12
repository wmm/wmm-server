USE wmm_reborn;

DROP VIEW IF EXISTS PopulatedRelations;
DROP VIEW IF EXISTS PopulatedLoans;

DROP TABLE IF EXISTS Relations;
DROP TABLE IF EXISTS Loans;
DROP TABLE IF EXISTS Tokens;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id int PRIMARY KEY auto_increment,
    username text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    total_lent double NOT NULL DEFAULT 0,
    total_borrowed double NOT NULL DEFAULT 0,
    current_lent double NOT NULL DEFAULT 0,
    current_borrowed double NOT NULL DEFAULT 0
);

CREATE TABLE Tokens (
    id int PRIMARY KEY auto_increment,
    user_id int NOT NULL, FOREIGN KEY (user_id) REFERENCES Users(id),
    token text NOT NULL
);

CREATE TABLE Loans (
    id int PRIMARY KEY auto_increment,
    sender_id int NOT NULL, FOREIGN KEY (sender_id) REFERENCES Users(id),
    reciever_id int NOT NULL, FOREIGN KEY (reciever_id) REFERENCES Users(id),
    creator_id int NOT NULL, FOREIGN KEY (creator_id) REFERENCES Users(id),
    amount double NOT NULL,
    created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status int NOT NULL DEFAULT 0,
    modified timestamp on update CURRENT_TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE Relations (
    id int PRIMARY KEY auto_increment,
    user1_id int NOT NULL, FOREIGN KEY (user1_id) REFERENCES Users(id),
    user2_id int NOT NULL, FOREIGN KEY (user2_id) REFERENCES Users(id),
    amount double NOT NULL DEFAULT 0
);

DELIMITER //
CREATE TRIGGER update_after_loan AFTER UPDATE ON Loans FOR EACH ROW BEGIN
    IF (old.status = 0) AND (new.status = 1) THEN

        SELECT id, user1_id INTO @id, @user1_id FROM Relations WHERE (user1_id = new.sender_id AND user2_id = new.reciever_id) OR (user1_id = new.reciever_id AND user2_id = new.sender_id);

        IF @id IS NULL THEN
            INSERT INTO Relations (user1_id, user2_id, amount) VALUES (new.sender_id, new.reciever_id, new.amount);
        ELSE
            IF @user1_id = new.sender_id THEN
                UPDATE Relations SET amount = amount + new.amount WHERE id = @id;
            ELSE
                UPDATE Relations SET amount = amount - new.amount WHERE id = @id;
            END IF;
        END IF;

        /* A better way exists without selecting all */
        SELECT IFNULL(sum(amount), 0) INTO @sender_l1 FROM Relations WHERE user1_id = new.sender_id AND amount > 0;
        SELECT IFNULL(sum(amount), 0) INTO @sender_l2 FROM Relations WHERE user2_id = new.sender_id AND amount < 0;
        SELECT IFNULL(sum(amount), 0) INTO @sender_b1 FROM Relations WHERE user2_id = new.sender_id AND amount > 0;
        SELECT IFNULL(sum(amount), 0) INTO @sender_b2 FROM Relations WHERE user1_id = new.sender_id AND amount < 0;
        SELECT IFNULL(sum(amount), 0) INTO @reciever_l1 FROM Relations WHERE user1_id = new.reciever_id AND amount > 0;
        SELECT IFNULL(sum(amount), 0) INTO @reciever_l2 FROM Relations WHERE user2_id = new.reciever_id AND amount < 0;
        SELECT IFNULL(sum(amount), 0) INTO @reciever_b1 FROM Relations WHERE user2_id = new.reciever_id AND amount > 0;
        SELECT IFNULL(sum(amount), 0) INTO @reciever_b2 FROM Relations WHERE user1_id = new.reciever_id AND amount < 0;

        UPDATE Users SET
            total_lent = total_lent + new.amount,
            current_lent = @sender_l1 - @sender_l2,
            current_borrowed = @sender_b1 - @sender_b2
            WHERE id = new.sender_id;
        UPDATE Users SET
            total_borrowed = total_borrowed + new.amount,
            current_lent = @reciever_l1 - @reciever_l2,
            current_borrowed = @reciever_b1 - @reciever_b2
            WHERE id = new.reciever_id;

    END IF;
END//
DELIMITER ;

CREATE VIEW PopulatedLoans AS
SELECT Loans.id, sender.username AS sender, reciever.username AS reciever, creator.username AS creator, Loans.amount, Loans.created, Loans.status, Loans.modified FROM Loans
LEFT JOIN Users AS sender ON Loans.sender_id=sender.id
LEFT JOIN Users AS reciever ON Loans.reciever_id=reciever.id
LEFT JOIN Users AS creator ON Loans.creator_id=creator.id;

CREATE VIEW PopulatedRelations AS
SELECT user1.username AS user1, user2.username AS user2, Relations.amount FROM Relations
LEFT JOIN Users AS user1 ON Relations.user1_id=user1.id
LEFT JOIN Users AS user2 ON Relations.user2_id=user2.id;