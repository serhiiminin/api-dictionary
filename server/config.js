require('dotenv').config();

const {
  DATAMUSE_SUGGESTION_ENDPOINT,
  FACEBOOK_GRAPH_QL,
  GOOGLE_API_KEY,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CHECK_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CSE_ID,
  GOOGLE_USER_URL,
  JWT_SECRET_KEY,
  MAILER_EMAIL_ID,
  MAILER_HOST,
  MAILER_PASSWORD,
  MAILER_PORT,
  MONGODB_URL,
  PORT,
  SEND_GRID_API_KEY,
  WORD_API_KEY,
  WORD_ENDPOINT,
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
    datamuse: {
      suggestions: DATAMUSE_SUGGESTION_ENDPOINT,
    },
    facebook: {
      graphQl: FACEBOOK_GRAPH_QL,
    },
    google: {
      checkToken: GOOGLE_CHECK_TOKEN,
      userData: GOOGLE_USER_URL,
    },
  },
  auth: {
    sendGrid: {
      apiKey: SEND_GRID_API_KEY,
    },
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
