const { Router } = require('express');
const router = Router();
const { createTweet, botStatus } = require('../controllers/tweets');

// Tweet Posting Route
router.all('/', createTweet);
router.all('/botstatus', botStatus);

module.exports = router;