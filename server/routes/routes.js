const AUTH = '/auth';
const AUTH_BASIC = `${AUTH}/basic`;
const AUTH_FACEBOOK = `${AUTH}/facebook`;
const AUTH_GOOGLE = `${AUTH}/google`;
const USERS = '/users';
const WORDS = '/words';

module.exports = {
  auth: {
    basic: {
      confirm: `${AUTH_BASIC}/confirm`,
      forgotPassword: `${AUTH_BASIC}/forgot-password`,
      logIn: `${AUTH_BASIC}/log-in`,
      resetPassword: `${AUTH_BASIC}/reset-password`,
      signUp: `${AUTH_BASIC}/sign-up`,
    },
    facebook: {
      logIn: `${AUTH_FACEBOOK}/log-in`,
      signUp: `${AUTH_FACEBOOK}/sign-up`,
    },
    google: {
      logIn: `${AUTH_GOOGLE}/log-in`,
      signUp: `${AUTH_GOOGLE}/sign-up`,
    },
  },
  users: {
    create: `${USERS}/new`,
    delete: `${USERS}/:id`,
    read: `${USERS}/:id`,
    update: `${USERS}/:id`,
  },
  words: {
    create: `${WORDS}/new`,
    delete: `${WORDS}/:id`,
    learn: `${WORDS}/:id/learn`,
    list: `${WORDS}/list`,
    read: `${WORDS}/:id`,
    search: `${WORDS}/search`,
    update: `${WORDS}/:id`,
  },
};
