const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Azure DevOps!');
});

module.exports = app;
