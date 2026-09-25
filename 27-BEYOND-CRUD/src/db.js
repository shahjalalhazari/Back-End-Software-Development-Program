const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function checkDatabaseConnection() {
  await pool.query('SELECT 1');
}

module.exports = {
  pool,
  query,
  checkDatabaseConnection
};
