const { Router } = require('express');
const authBasic = require('../controllers/auth/basic');
const authGoogle = require('../controllers/auth/google');
const authFacebook = require('../controllers/auth/facebook');
const asyncMiddleware = require('../utils/auth').asyncMiddleware;
const isTokenValid = require('../utils/auth').isTokenValid;
const routes = require('./routes');

const router = Router();
const { basic, facebook, google } = routes.auth;

router.all('*', asyncMiddleware(authBasic.removeUnconfirmed));
router.get(basic.confirm, asyncMiddleware(isTokenValid), asyncMiddleware(authBasic.confirm));
router.post(basic.forgotPassword, asyncMiddleware(authBasic.forgotPassword));
router.post(basic.logIn, asyncMiddleware(authBasic.logIn));
router.post(basic.resetPassword, asyncMiddleware(isTokenValid), asyncMiddleware(authBasic.resetPassword));
router.post(basic.signUp, asyncMiddleware(authBasic.signUp));

router.get(facebook.logIn, asyncMiddleware(authFacebook.logIn));
router.get(facebook.signUp, asyncMiddleware(authFacebook.signUp));

router.get(google.logIn, asyncMiddleware(authGoogle.logIn));
router.get(google.signUp, asyncMiddleware(authGoogle.signUp));

module.exports = router;
