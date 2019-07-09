const jwt = require('jsonwebtoken');
const util = require('util');
const boom = require('@hapi/boom');
const config = require('../config');
const JWT_SECRET_KEY = config.jwt.secretKey;

const jwtVerify = util.promisify(jwt.verify);

const getBearerToken = headers => {
  const proxyAuthHeader = headers['authorization'];

  return proxyAuthHeader ? proxyAuthHeader.split(' ')[1] : '';
};

exports.isTokenValid = async (request, response, next) => {
  const bearerToken = getBearerToken(request.headers);
  try {
    request.authData = await jwtVerify(bearerToken, JWT_SECRET_KEY);
    next();
  } catch (e) {
    throw boom.unauthorized();
  }
};

exports.asyncMiddleware = func => (request, response, next) => {
  Promise.resolve(func(request, response, next)).catch(error => {
    if (!error.isBoom) {
      return next(boom.badImplementation(error.message));
    }
    next(error);
  });
};

exports.getBearerToken = getBearerToken;
