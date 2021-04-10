const { Router } = require('express');
const router = Router();
const { createTweet } = require('../controllers/tweets');

// Tweet Posting Route
router.all('/', createTweet );

module.exports = router;