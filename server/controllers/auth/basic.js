const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const config = require('../../config');
const dateUtils = require('../../utils/date');
const boom = require('boom');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.auth.sendGrid.apiKey);

const EMAIL_FROM = 'support@dictionary.com';
const JWT_SECRET_KEY = config.jwt.secretKey;

const jwtSign = util.promisify(jwt.sign);

const getTokenExpirationDate = () => Date.now() + 24 * 60 * 60 * 1000;
const generateUrlWithToken = (url, token) => `${url}?token=${token}`;

const validateConditions = conditions => {
  for (let i = 0; i < conditions.length; i++) {
    if (conditions[i]) {
      throw boom.badRequest(conditions[i]);
    }
  }
};

exports.signUp = async (request, response) => {
  const { name, email, password, passwordConfirm, appEndpoint } = request.body;
  validateConditions([
    (!email || !password) && 'email and password are required fields',
    password && password.length < 8 && "password's length shouldn't less than 8 characters",
    password !== passwordConfirm && 'passwords do not match each other',
    !appEndpoint && 'pass endpoint for generating confirmation link',
  ]);

  const user = await User.findOne({ email });
  if (user) {
    throw boom.badData('account already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const token = await jwtSign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });
  const newUser = new User({
    name,
    email,
    password: passwordHash,
    expires: getTokenExpirationDate(),
  });
  const createdUser = await newUser.save();
  const reference = generateUrlWithToken(appEndpoint, token);
  const mailData = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Confirm registration!',
    html: `<div> 
        <p>Please, confirm registration!</p>
        <a href=${reference}>Follow this to confirm</a>
      </div>`,
  };
  await sgMail.send(mailData);
  response.status(200).json({ message: 'New user has been created', data: createdUser });
};

exports.confirm = async (request, response) => {
  const { email } = request.authData;
  const user = await User.findOne({ email });
  const { _id, active } = user || {};

  validateConditions([!user && 'user has not been found', active && 'the account has been already activated']);

  await User.findByIdAndUpdate(_id, {
    $set: { active: true },
    $unset: { expires: '' },
  });
  const emailData = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Welcome!',
    html: `<div> 
        <h2>Hello, ${user.name || 'friend'}! Welcome to the team!</h2>
      </div>`,
  };

  await sgMail.send(emailData);
  const token = await jwtSign({ email, _id }, JWT_SECRET_KEY, { expiresIn: '1d' });
  response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
};

exports.logIn = async (request, response) => {
  const { email, password } = request.body;

  validateConditions([
    (!email || !password) && 'email and password are required fields',
    password && password.length < 8 && "password's length shouldn't less than 8 characters",
  ]);

  const user = await User.findOne({ email });
  const isUserActive = Boolean(user && user.active);
  if (!user || !isUserActive) {
    throw boom.unauthorized('invalid credentials');
  }
  const { _id } = user;
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw boom.unauthorized('invalid credentials');
  }
  const token = await jwtSign({ email, _id }, JWT_SECRET_KEY, { expiresIn: '1d' });
  response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
};

exports.forgotPassword = async (request, response) => {
  const { email, appEndpoint } = request.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw boom.notFound('user with this email is not found');
  }
  const token = await jwtSign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });
  await User.findByIdAndUpdate(user._id, dataToUpdate, { upsert: true, new: true });
  const resetReference = generateUrlWithToken(appEndpoint, token);
  const data = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Password help has arrived!',
    html: `<div> 
      <p>Password help has arrived!</p>
      <a href=${resetReference}>Follow this</a>
    </div>`,
  };
  await sgMail.send(data);
  response.json({ message: 'Kindly check your email for further instructions' });
};

exports.resetPassword = async (request, response) => {
  const { email, _id } = request.authData;
  const { password, passwordConfirm } = request.body;
  if (password !== passwordConfirm) {
    throw boom.badData('passwords dont match');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw boom.badRequest('Password reset token is invalid or has expired.');
  }
  await User.findByIdAndUpdate(_id, {
    password: bcrypt.hashSync(password, 10),
  });
  const data = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Password Reset Confirmation',
    html: `<div> 
      <p>Password has been reset successfully!</p>
    </div>`,
  };

  await sgMail.send(data);
  const token = await jwtSign({ email, _id }, JWT_SECRET_KEY, { expiresIn: '1d' });
  response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
};

exports.removeUnconfirmed = async (request, response, next) => {
  try {
    await User.deleteMany({
      active: { $ne: true },
      resetPasswordExpires: { $lte: Date.now() },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};
