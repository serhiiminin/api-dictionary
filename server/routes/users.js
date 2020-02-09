const { Router } = require('express');
const usersController = require('../controllers/users');
const isTokenValid = require('../utils/auth').isTokenValid;
const asyncMiddleware = require('../utils/auth').asyncMiddleware;
const routes = require('./routes');

const router = Router();
const { users } = routes;

router.use(asyncMiddleware(isTokenValid));

router.post(users.create, asyncMiddleware(usersController.create));
router.get(users.read, asyncMiddleware(usersController.findOne));
router.put(users.update, asyncMiddleware(usersController.update));
router.delete(users.delete, asyncMiddleware(usersController.delete));

module.exports = router;
