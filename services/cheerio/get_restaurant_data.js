const cheerio = require('cheerio');
const axiosFunctions = require('../axios');

/**
 * This function fetches html of restaurant page which contain restaurant data.
 * make an array of all the script tags
 * find the script tag which contains restaurant data
 * extract restaurant data from the script tag
 * remove unwanted data
 * @param {String} restaurantURL - The restaurant URL of which you want to extract the data
 * @returns {Object} compiledRestaurantData - The complete restaurant data with its basic detail & menu.
 */

exports.getRestaurantData = async (restaurantURL) => {
  try {
    if (!restaurantURL) {
      return [];
    }
    const html = await axiosFunctions.simpleGetReq(restaurantURL);
    const $ = cheerio.load(html);
    const scriptTags = $('script').contents();
    const compiledRestaurantData = {};
    let tempData = '';

    tempData = scriptTags
      .filter(function () {
        const scriptTag = $(this).text();
        return (
          scriptTag.includes('window.___INITIAL_STATE__') &&
          scriptTag.includes('window._csrfToken')
        );
      })
      .text()
      .split('=');

    tempData = ` ${tempData[2]} = ${tempData[3]} + ${tempData[4]}`.replace(
      ';   window.webpackManifest ',
      '',
    );

    tempData = JSON.parse(tempData).menu;

    compiledRestaurantData.details = tempData.restaurant;
    delete compiledRestaurantData.details.experiments; // TODO: remove more stuff which is not required
    compiledRestaurantData.menuItems = tempData.items;

    return compiledRestaurantData;
  } catch (error) {
    console.error(`Stuff went wrong with getRestaurantData, error: ${error}`);
  }
};
