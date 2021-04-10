const tracery = require('tracery-grammar'),
  rawQuotes = require('./quotes.json'),
  processedGrammar = tracery.createGrammar(rawQuotes);
processedGrammar.addModifiers(tracery.baseEngModifiers);

const generateStatus = () => {
  // Generate a new tweet using our grammar
  return processedGrammar.flatten("#origin#");
}

module.exports = {
  generateStatus,
}