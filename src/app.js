// src/app.js
const express = require('express');
const app = express();

app.get('/', (_, res) => {
  res.send('✅ Hello from Azure DevOps deployed Web App!');
});

module.exports = app;
