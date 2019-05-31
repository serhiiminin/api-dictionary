require('dotenv').config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  GOOGLE_API_KEY,
  GOOGLE_CSE_ID,
  WORD_API_KEY,
  WORD_ENDPOINT,
  MONGODB_URL,
  PORT,
  JWT_SECRET_KEY,
  MAILER_EMAIL_ID,
  MAILER_PASSWORD,
  MAILER_HOST,
  MAILER_PORT,
  FACEBOOK_GRAPH_QL,
  GOOGLE_CHECK_TOKEN,
  GOOGLE_USER_URL,
} = process.env;

module.exports = {
  env: {
    port: PORT,
  },
  jwt: {
    secretKey: JWT_SECRET_KEY,
  },
  mongo: {
    url: MONGODB_URL,
  },
  endpoints: {
    facebook: {
      graphQl: FACEBOOK_GRAPH_QL,
    },
    google: {
      checkToken: GOOGLE_CHECK_TOKEN,
      userData: GOOGLE_USER_URL,
    },
  },
  auth: {
    mail: {
      host: MAILER_HOST,
      port: MAILER_PORT,
      id: MAILER_EMAIL_ID,
      password: MAILER_PASSWORD,
    },
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackUrl: GOOGLE_CALLBACK_URL,
      apiKey: GOOGLE_API_KEY,
      cseId: GOOGLE_CSE_ID,
    },
    word: {
      endpoint: WORD_ENDPOINT,
      apiKey: WORD_API_KEY,
    },
  },
};
