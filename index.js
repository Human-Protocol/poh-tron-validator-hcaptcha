const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const api = require('./api.js');
const { port } = require( './config.js');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static('public'));

app.use('/api/v1', cors(), api);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

const listener = app.listen(port, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

module.exports = app; // for testing
