CREATE DATABASE jwttodo;

CREATE TABLE users(
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE cards(
    card_id SERIAL,
    user_id UUID,
    card_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (card_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE todos(
    todo_id SERIAL,
    card_id SERIAL,
    user_id UUID,
    todo_title VARCHAR(255),
    todo_priority INTEGER DEFAULT 0 NOT NULL,
    todo_due DATE,
    PRIMARY KEY (todo_id),
    FOREIGN KEY (card_id) REFERENCES cards(card_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);