const express = require('express');
const students = require('./data');
const { sendSuccess, sendError } = require('./utils/response');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Student API is running' });
});

app.get('/api/students', (req, res) => {
  sendSuccess(res, students);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find((item) => item.id === Number(req.params.id));

  if (!student) {
    return sendError(res, 404, "STUDENT_NOT_FOUND", "No student found with that ID")
  }

  sendSuccess(res, student);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});