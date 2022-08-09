CREATE TABLE IF NOT EXISTS repositories
(
    ID SERIAL PRIMARY KEY,
    FILE character varying(255) NOT NULL UNIQUE,
    PATH character varying(255) NOT NULL UNIQUE,
    createdAt character varying(255) NOT NULL
);