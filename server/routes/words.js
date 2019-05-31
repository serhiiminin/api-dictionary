const { Router } = require('express');
const words = require('../controllers/words');
const isTokenValid = require('../utils/auth').isTokenValid;
const asyncMiddleware = require('../utils/auth').asyncMiddleware;
const routes = require('./routes');

const router = Router();

router.use(asyncMiddleware(isTokenValid));

router.post(routes.words.create, asyncMiddleware(words.create));
router.get(routes.words.read, asyncMiddleware(words.findOne));
router.post(routes.words.list, asyncMiddleware(words.findAll));
router.put(routes.words.update, asyncMiddleware(words.update));
router.delete(routes.words.delete, asyncMiddleware(words.delete));
router.put(routes.words.learn, asyncMiddleware(words.learnWord));
router.post(routes.words.search, asyncMiddleware(words.search));

module.exports = router;
