# Express PostgreSQL API

A minimal Node.js Express project connected to PostgreSQL through the `pg` package.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set your PostgreSQL connection details.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Or start it normally:

   ```bash
   npm start
   ```

The API runs at `http://localhost:3000` by default.

## Database schema

Apply the user table schema after creating the `userDB` database:

```bash
psql "$env:DATABASE_URL" -f database/schema.sql
```

The schema creates a `users` table with `id`, `name`, `email`, `username`, and `createdAt`. Email addresses and usernames are unique without regard to letter case.

## Routes

- `GET /` returns a basic API message.
- `GET /health` checks the PostgreSQL connection and returns `connected` or `disconnected`.

The database helper is in `src/db.js`. Use its exported `query` function for parameterized SQL queries in additional routes.
