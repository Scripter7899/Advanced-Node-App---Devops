const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from Azure DevOps!');
});

module.exports = app;
