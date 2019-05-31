const { Router } = require('express');
const users = require('../controllers/users');
const isTokenValid = require('../utils/auth').isTokenValid;
const asyncMiddleware = require('../utils/auth').asyncMiddleware;
const routes = require('./routes');

const router = Router();

router.use(asyncMiddleware(isTokenValid));

router.post(routes.users.create, asyncMiddleware(users.create));
router.get(routes.users.read, asyncMiddleware(users.findOne));
router.put(routes.users.update, asyncMiddleware(users.update));
router.delete(routes.users.delete, asyncMiddleware(users.delete));

module.exports = router;
