USE wmm_reborn;

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