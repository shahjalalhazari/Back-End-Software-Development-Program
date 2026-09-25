require('dotenv').config({ override: true });

const express = require('express');
const { checkDatabaseConnection, pool } = require('./db');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (request, response) => {
  response.json({
    message: 'Express PostgreSQL API is running'
  });
});

app.get('/health', async (request, response) => {
  try {
    await checkDatabaseConnection();
    response.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    response.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({
    error: 'Internal server error'
  });
});

// GET ALL USERS
app.get("/users", async(req, res) => {
  const result = await pool.query(
    "SELECT * from users"
  );
  return res.json(result.rows[0])
})

// PUT METHOD
app.put("/users/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const {name, email} = req.body;
    const result =  await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: "User not found."});
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// PATCH METHOD
app.patch("/users/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const fields = [];
    const values = [];
    let i = 1;

    if (req.body.name !== undefined) {
      fields.push(`name = $${i++}`);
      values.push(req.body.name);
    };
    if (req.body.email !== undefined) {
      fields.push(`email = $${i++}`);
      values.push(req.body.email);
    };
    if (req.body.username !== undefined) {
      fields.push(`username = $${i++}`);
      values.push(req.body.username);
    };

    if (fields.length === 0) {
      return res.status(400).json({error: "No fields to update."});
    };

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).json({error: "User not found"});
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
