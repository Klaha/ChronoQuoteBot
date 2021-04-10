const { response } = require('express');
var Twit = require('twit');
const storage = require('node-persist')

const { twitConfig } = require('../helpers/twit-config');

// Storage Init.
storage.initSync();

const threeHoursSinceLastTweet = (actualDate) => {
  const lastTweet = storage.getItemSync("lastRun") || 0;
  const threeHoursSinceLastTweet = lastTweet + (180 * 60 * 1000);
  return actualDate > threeHoursSinceLastTweet;
}

const createTweet = async (req, res = response) => {
  const now = Date.now();

  // We check if at least 3 hours has passed since last tweet
  if (!threeHoursSinceLastTweet(now)) {
    return res.status(401).json({
      ok: false,
      msg: 'Slowdown! Lets wait a little bit'
    })
  }

  // We proceed to create an instance of Twit and tweet.
  const T = new Twit(twitConfig);
  T.post('statuses/update', { status: 'hello world v7' }, (err) => {
    if (!err) {

      // We set actual time (now) into storage.
      storage.setItemSync("lastRun", now);

      res.json({
        ok: true,
        msg: 'Tweet Created',
      });
    } else {
      res.status(500).json({
        ok: false,
        msg: 'There was a problem creating the tweet',
        err
      })
    }
  });

};

module.exports = {
  createTweet
}