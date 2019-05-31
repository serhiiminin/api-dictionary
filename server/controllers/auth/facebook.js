const jwt = require('jsonwebtoken');
const util = require('util');
const boom = require('boom');
const mongoose = require('mongoose');
const User = require('../../models/users');
const fetch = require('isomorphic-unfetch');
const config = require('../../config');
const dateUtils = require('../../utils/date');
const authUtils = require('../../utils/auth');

const jwtSign = util.promisify(jwt.sign);

const JWT_SECRET_KEY = config.jwt.secretKey;
const FIELDS = ['email', 'name', 'education', 'gender', 'first_name', 'interested_in', 'location'];

const generateUserDataUrl = (endpoint, fields) => token => `${endpoint}/me?access_token=${token}&fields=${fields}`;

const userDataUrl = generateUserDataUrl(config.endpoints.facebook.graphQl, FIELDS.join(','));

exports.signUp = async (request, response) => {
  const proxyToken = authUtils.getBearerToken(request.headers);
  const facebookResponse = await fetch(userDataUrl(proxyToken));
  if (facebookResponse.status !== 200) {
    throw boom.unauthorized('invalid token');
  }
  const userData = await facebookResponse.json();
  const { id, email, name = '', first_name = '', last_name = '' } = userData;
  const foundUser = await User.findOne({ facebookId: id });
  if (foundUser) {
    const { _id, additionalEmail } = foundUser;

    const token = await jwtSign({ _id, additionalEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });
    return response.send({ token, userId: _id, expiresAt });
  }
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    fullName: name,
    firstName: first_name,
    lastName: last_name,
    facebookId: id,
    additionalEmail: email,
  });
  try {
    const createdUser = await newUser.save();
    const { _id, additionalEmail } = createdUser;
    const token = await jwtSign({ _id, additionalEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });

    response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
  } catch (error) {
    throw boom.badData('cannot create an user');
  }
};

exports.logIn = async (request, response) => {
  const proxyToken = authUtils.getBearerToken(request.headers);
  const facebookResponse = await fetch(userDataUrl(proxyToken));
  if (facebookResponse.status !== 200) {
    throw boom.unauthorized('invalid token');
  }
  const userData = await facebookResponse.json();
  const { id } = userData;
  const user = await User.findOne({ facebookId: id });
  if (!user) {
    throw boom.notFound('account is not found');
  }
  const { _id, additionalEmail } = user;
  const token = await jwtSign({ _id, additionalEmail }, JWT_SECRET_KEY, { expiresIn: '1d' });

  response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
};
