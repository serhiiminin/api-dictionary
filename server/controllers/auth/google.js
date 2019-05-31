const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const util = require('util');
const boom = require('boom');
const User = require('../../models/users');
const fetch = require('isomorphic-unfetch');
const config = require('../../config');
const dateUtils = require('../../utils/date');
const authUtils = require('../../utils/auth');

const jwtSign = util.promisify(jwt.sign);

const JWT_SECRET_KEY = config.jwt.secretKey;

const googleUserData = endpoint => token => `${endpoint}${token}`;
const getGoogleUserDataUrl = googleUserData(config.endpoints.google.userData);

exports.signUp = async (request, response) => {
  const proxyToken = authUtils.getBearerToken(request.headers);
  const googleResponse = await fetch(getGoogleUserDataUrl(proxyToken));
  if (googleResponse.status !== 200) {
    throw boom.unauthorized('invalid token');
  }
  const userData = await googleResponse.json();
  const foundUser = await User.findOne({ googleId: userData.id });
  if (foundUser) {
    const { _id, additionalEmail } = foundUser;

    const token = await jwtSign({ _id, additionalEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });
    return response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
  }
  const { email, family_name, given_name, googleId, picture, name } = userData || {};
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    fullName: name,
    firstName: given_name,
    lastName: family_name,
    imageUrl: picture,
    googleId,
    additionalEmail: email,
  });
  try {
    const createdUsed = await newUser.save();
    const { _id, additionalEmail } = createdUsed;
    const token = await jwtSign({ _id, additionalEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });

    response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
  } catch (error) {
    throw boom.badData('cannot create an user');
  }
};

exports.logIn = async (request, response) => {
  const proxyToken = authUtils.getBearerToken(request.headers);
  const googleResponse = await fetch(getGoogleUserDataUrl(proxyToken));
  if (googleResponse.status !== 200) {
    throw boom.unauthorized('invalid token');
  }
  const userData = await googleResponse.json();
  const { user_id } = userData;
  const foundUser = await User.findOne({ googleId: user_id });
  if (!foundUser) {
    throw boom.notFound('account is not found');
  }
  const { _id, additionalEmail } = foundUser;

  const token = await jwt.sign({ _id, additionalEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });
  response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
};
