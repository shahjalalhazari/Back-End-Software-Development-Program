CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(trim(name)) > 0),
  email VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
  ON users (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique
  ON users (lower(username));
