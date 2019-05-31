const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../../models/users');
const config = require('../../config');
const dateUtils = require('../../utils/date');
const boom = require('boom');

const EMAIL = config.auth.mail.id;
const JWT_SECRET_KEY = config.jwt.secretKey;

const jwtSign = util.promisify(jwt.sign);

const getTokenExpirationDate = () => Date.now() + 24 * 60 * 60 * 1000;
const generateUrlWithToken = (url, token) => `${url}?token=${token}`;

const smtpTransport = nodemailer.createTransport({
  host: config.auth.mail.host,
  port: config.auth.mail.port,
  secure: true,
  auth: {
    user: config.auth.mail.id,
    pass: config.auth.mail.password,
  },
});

const smtpTransportSendMail = data =>
  smtpTransport.sendMail(data, error => {
    if (error) {
      throw boom.badRequest('cannot send an email');
    }
  });

exports.signUp = async (request, response) => {
  const { name, email, password, passwordConfirm, appEndpoint } = request.body;
  const validationMessages = [
    (!email || !password) && 'email and password are required fields',
    password && password.length < 8 && "password's length shouldn't less than 8 characters",
    password !== passwordConfirm && 'passwords do not match each other',
    !appEndpoint && 'pass endpoint for generating confirmation link',
  ].filter(Boolean);
  if (validationMessages[0]) {
    throw boom.badRequest(validationMessages[0]);
  }

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
    from: EMAIL,
    subject: 'Confirm registration!',
    html: `<div> 
        <p>Please, confirm registration!</p>
        <a href=${reference}>Follow this to confirm</a>
      </div>`,
  };
  await smtpTransportSendMail(mailData);
  response.status(200).json({ message: 'New user has been created', data: createdUser });
};

exports.confirm = async (request, response) => {
  const { email } = request.authData;
  const user = await User.findOne({ email });
  const { _id, active } = user || {};
  const validationMessages = [
    !user && 'user has not been found',
    active && 'the account has been already activated',
  ].filter(Boolean);
  if (validationMessages[0]) {
    throw boom.badRequest(validationMessages[0]);
  }
  await User.findByIdAndUpdate(_id, {
    $set: { active: true },
    $unset: { expires: '' },
  });
  const emailData = {
    to: email,
    from: EMAIL,
    subject: 'Welcome!',
    html: `<div> 
        <h2>Hello, ${user.name || 'friend'}! Welcome to the team!</h2>
      </div>`,
  };

  await smtpTransportSendMail(emailData);
  const token = await jwtSign({ email, _id }, JWT_SECRET_KEY, { expiresIn: '1d' });
  response.send({ token, userId: _id, expiresAt: dateUtils.getOneDayMilliseconds() });
};

exports.logIn = async (request, response) => {
  const { email, password } = request.body;
  const validationMessages = [
    (!email || !password) && 'email and password are required fields',
    password && password.length < 8 && "password's length shouldn't less than 8 characters",
  ].filter(Boolean);
  if (validationMessages[0]) {
    throw boom.badRequest(validationMessages[0]);
  }

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
    from: EMAIL,
    subject: 'Password help has arrived!',
    html: `<div> 
      <p>Password help has arrived!</p>
      <a href=${resetReference}>Follow this</a>
    </div>`,
  };
  await smtpTransportSendMail(data);
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
    from: EMAIL,
    subject: 'Password Reset Confirmation',
    html: `<div> 
      <p>Password has been reset successfully!</p>
    </div>`,
  };

  await smtpTransportSendMail(data);
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
