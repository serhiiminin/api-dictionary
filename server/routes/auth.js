const { Router } = require('express');
const authBasic = require('../controllers/auth/basic');
const authGoogle = require('../controllers/auth/google');
const authFacebook = require('../controllers/auth/facebook');
const asyncMiddleware = require('../utils/auth').asyncMiddleware;
const isTokenValid = require('../utils/auth').isTokenValid;
const routes = require('./routes');

const router = Router();

router.all('*', asyncMiddleware(authBasic.removeUnconfirmed));
router.get(routes.auth.basic.confirm, asyncMiddleware(isTokenValid), asyncMiddleware(authBasic.confirm));
router.post(routes.auth.basic.forgotPassword, asyncMiddleware(authBasic.forgotPassword));
router.post(routes.auth.basic.logIn, asyncMiddleware(authBasic.logIn));
router.post(routes.auth.basic.resetPassword, asyncMiddleware(isTokenValid), asyncMiddleware(authBasic.resetPassword));
router.post(routes.auth.basic.signUp, asyncMiddleware(authBasic.signUp));

router.get(routes.auth.facebook.logIn, asyncMiddleware(authFacebook.logIn));
router.get(routes.auth.facebook.signUp, asyncMiddleware(authFacebook.signUp));

router.get(routes.auth.google.logIn, asyncMiddleware(authGoogle.logIn));
router.get(routes.auth.google.signUp, asyncMiddleware(authGoogle.signUp));

module.exports = router;
