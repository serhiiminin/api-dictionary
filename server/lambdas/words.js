const express = require('express');
const cors = require('cors');
const config = require('../config');
const boom = require('@hapi/boom');
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

app.use(cors());
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
