// This code was originally written by @jacobschwantes in this
// repository: https://github.com/jacobschwantes/eight-ball-api
// and then modified by me (@scastd00) to fit my needs.

const Sentiment = require('sentiment');
const { positive, neutral, negative } = require('./readings');

const sentiment = new Sentiment({});

/**
 * Get a reply from the 8-ball. If lucky is true, the reply will be positive.
 * If lucky is false, the reply will be negative.
 *
 * @param {string} question - The question to ask the 8-ball.
 * @param {boolean} lucky - Whether the user is lucky.
 * @returns {{lucky, sentiment: {calculation: [], score: *, negative: [], comparative: number, words: [], tokens: Array, positive: []}, question, reading: string}}
 */
function getReply(question, lucky) {
  let rating = sentiment.analyze(question);
  const random = Math.random();
  let response;

  if ((rating.score > 0 && lucky) || (rating.score < 0 && !lucky)) {
    response = {
      question,
      reading: positive[(Math.floor(random * positive.length))],
      sentiment: rating
    };
  } else if ((rating.score < 0 && lucky) || (rating.score > 0 && !lucky)) {
    response = {
      question,
      reading: negative[(Math.floor(random * negative.length))],
      sentiment: rating
    };
  } else {
    response = {
      question,
      reading: neutral[(Math.floor(random * neutral.length))],
      sentiment: rating
    };
  }

  return response;
}

module.exports = getReply;
