const express = require('express');
const config = require('../config');
const boom = require('boom');
const mongoose = require('mongoose');
const wordsRouter = require('../routes/words');

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongo.url, config.mongoose)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.log('Could not connect to MongoDB.', err);
    process.exit();
  });

const app = express();

app.use(require('cors')());
app.use(express.json());
app.use(wordsRouter);
app.use((error, request, response, next) => {
  if (error.isBoom) {
    const { statusCode, payload } = error.output;
    return response.status(statusCode).json(payload);
  }
  const { payload, statusCode } = boom.badImplementation().output;
  console.log(statusCode);

  return response.status(statusCode).json(payload);
});

module.exports = app;
