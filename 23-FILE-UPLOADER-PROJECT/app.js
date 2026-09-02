const express = require('express');
const routes = require('./routes');

const app = express();
const DEFAULT_PORT = 3000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

app.use('/', routes);

const fileRoutes = require("./routes/upload")
app.use("/file", fileRoutes);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    throw err;
  });
};

startServer(PORT);
