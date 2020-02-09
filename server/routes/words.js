const { Router } = require('express');
const wordsController = require('../controllers/words');
const isTokenValid = require('../utils/auth').isTokenValid;
const asyncMiddleware = require('../utils/auth').asyncMiddleware;
const routes = require('./routes');

const router = Router();
const { words } = routes;

router.use(asyncMiddleware(isTokenValid));

router.post(words.create, asyncMiddleware(wordsController.create));
router.get(words.read, asyncMiddleware(wordsController.findOne));
router.post(words.list, asyncMiddleware(wordsController.findAll));
router.put(words.update, asyncMiddleware(wordsController.update));
router.delete(words.delete, asyncMiddleware(wordsController.delete));
router.put(words.learn, asyncMiddleware(wordsController.learnWord));
router.post(words.search, asyncMiddleware(wordsController.search));

module.exports = router;
