USE wmm_reborn;

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
    confirmed timestamp
);

CREATE TABLE Relations (
    id int PRIMARY KEY auto_increment,
    user1_id int NOT NULL, FOREIGN KEY (user1_id) REFERENCES Users(id),
    user2_id int NOT NULL, FOREIGN KEY (user2_id) REFERENCES Users(id),
    amount double NOT NULL DEFAULT 0
);

DELIMITER //
CREATE TRIGGER update_after_loan AFTER UPDATE ON Loans FOR EACH ROW BEGIN
    IF old.confirmed IS NULL AND new.confirmed IS NOT NULL THEN
        IF (SELECT count(*) AS num FROM Relations WHERE (user1_id = new.sender_id AND user2_id = new.reciever_id) OR (user1_id = new.reciever_id AND user2_id = new.reciever_id)) = 0 THEN
            INSERT INTO Relations (user1_id, user2_id) VALUES (new.sender_id, new.reciever_id);
        END IF;
    END IF;
END; //
DELIMITER ;