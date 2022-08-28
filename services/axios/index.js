const axios = require('axios').default;

const headers = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
  },
};

/**
 *
 * @param {String} destUrl - Make a get request to this URL
 * @returns {String} - GET request response
 */

exports.simpleGetReq = async (destUrl) => {
  try {
    return (await axios.get(destUrl, headers)).data;
  } catch (error) {
    console.error(`Stuff went wrong with simpleGetReq, error: ${error}`);
  }
};
