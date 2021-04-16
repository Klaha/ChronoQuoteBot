const fs = require('fs');

const getConnectionLog = () => {
  const info = fs.readFileSync('./logs/connection-logger.json', {
    encoding: 'utf-8'
  });
  return JSON.parse(info);
}

const saveConnectionLog = (time_now) => {
  const data = getConnectionLog();
  data.push({
    lastPing: new Date(time_now).toLocaleString("es-ES", { timeZone: 'America/Santiago' })
  })
  fs.writeFileSync(`./logs/connection-logger.json`, JSON.stringify(data));
}

const getResponseLog = () => {
  const info = fs.readFileSync('./logs/response-logger.json', {
    encoding: 'utf-8'
  });
  return JSON.parse(info);
}

const saveResponseLog = (time_now, could_tweet) => {
  const data = getResponseLog();
  data.push({
    couldTweet: could_tweet,
    lastPing: new Date(time_now).toLocaleString("es-ES", { timeZone: 'America/Santiago' })
  })
  fs.writeFileSync(`./logs/response-logger.json`, JSON.stringify(data));
}

module.exports = {
  getConnectionLog,
  saveConnectionLog,
  getResponseLog,
  saveResponseLog
}