const express = require('express');
const config = require('../config');
const boom = require('@hapi/boom');
const mongoose = require('mongoose');
const authRouter = require('../routes/auth');

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
app.use(authRouter);
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

// const port = config.env.port || 8000;
//
// const index = app.listen(port, () => {
//   const host = index.address().address;
//   const port = index.address().port;
//
//   console.log('App listening at http://%s:%s', host, port);
// });
