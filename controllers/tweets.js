const { response } = require('express');
var Twit = require('twit');
const storage = require('node-persist')

const { twitConfig } = require('../helpers/twit-config');
const { generateStatus } = require('../helpers/generate-status');
const { saveConnectionLog, saveResponseLog, getConnectionLog, getResponseLog } = require('../helpers/logger');

(async () => {
  // Storage Init
  await storage.init();
})();

const twelveHoursSinceLastTweet = async (actualDate) => {
  const lastTweet = await storage.getItem("lastRun") || 0;
  const twelveHoursSinceLastTweet = lastTweet + (720 * 60 * 1000);
  return actualDate > twelveHoursSinceLastTweet;
}

const createTweet = async (req, res = response) => {
  const now = Date.now();
  saveConnectionLog(now);

  // We check if at least 3 hours has passed since last tweet
  const allowedToPost = await twelveHoursSinceLastTweet(now);

  if (!allowedToPost) {
    saveResponseLog(now, false);
    res.status(200).json({
      ok: false,
      msg: 'Slowdown! Lets wait a little bit',
      allowedToPost
    });
    return;
  }

  // We generate a new status using tracery.
  const status = generateStatus();

  // We proceed to create an instance of Twit and tweet.
  const T = new Twit(twitConfig);
  T.post('statuses/update', { status }, async (err) => {
    if (!err) {

      // We set actual time (now) into storage.
      await storage.setItem("lastRun", now);
      saveResponseLog(now, true);

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

const botStatus = async (req, res = response) => {
  let lastTweetWasOn = new Date(await storage.getItem("lastRun")).toLocaleString("es-ES", { timeZone: "America/Santiago" });
  let nextTweetOn = new Date(await storage.getItem("lastRun") + (720 * 60 * 1000)).toLocaleString("es-ES", { timeZone: "America/Santiago" });

  res.status(200).json({
    connectionLog: getConnectionLog(),
    responseLog: getResponseLog(),
    lastTweetWasOn,
    nextTweetOn
  })
};

module.exports = {
  createTweet,
  botStatus
}