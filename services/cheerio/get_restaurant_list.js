const cheerio = require('cheerio');
const axiosFunctions = require('../axios');

/*
 * This function open city page & get its HTML
 * extract all restaurants from current page
 * compile an array with all restaurants data
 * @param {String} cityURL - The city URL of which you want to extract the restaurants
 * @param {String} pageNumber - page number to extract restaurants data
 * @returns {Object} extractedData
 */
const extractData = async (cityURL, pageNumber = 1) => {
  console.log('fetching data from: ', `${cityURL}?page=${pageNumber}`);
  const html = await axiosFunctions.simpleGetReq(
    `${cityURL}?page=${pageNumber}`,
  );
  const $ = cheerio.load(html);
  const scriptTags = $('script').contents();
  let tempData = '';
  const extractedData = {};

  const mainScriptTag = scriptTags
    .filter(function () {
      const scriptTag = $(this).text();
      if (
        scriptTag.includes('window.___INITIAL_STATE__') &&
        scriptTag.includes('window._csrfToken')
      ) {
        return true;
      }
      return false;
    })
    .text()
    .split('=');

  const cardsDataStartAt = mainScriptTag.findIndex((tempItem) =>
    tempItem.includes('cityPageData'),
  );

  // extract cityPageData & parse it
  tempData = mainScriptTag
    .slice(cardsDataStartAt, mainScriptTag.length - 3)
    .join('=')
    .replace(';  window.showScriptLoadFailureMessage', '')
    .trim();
  tempData = JSON.parse(tempData);

  // on first run, find the total number of pages
  if (1 === pageNumber) {
    extractedData.totalPages = tempData.cityRestaurantData.pages;
  }

  extractedData.restaurantCards = tempData.cityRestaurantData.cards;

  // extract anchor tag from HTML
  const restaurantsContainer = $('#restaurants_container div>a');
  const anchorTags = [];
  restaurantsContainer.each(function () {
    const hrefValue = $(this).attr('href');
    if (hrefValue && hrefValue.includes('/restaurants/')) {
      anchorTags.push(`https://www.swiggy.com${hrefValue}`);
    }
  });

  extractedData.restaurantUrls = anchorTags;
  return extractedData;
};

/**
 * This function will extract all the restaurants data of the provided city
 * @param {String} cityURL - The city URL of which you want to extract the restaurants
 * @returns {Array} compiledRestaurantsList
 */

exports.getRestaurantListData = async (cityURL) => {
  try {
    if (!cityURL) {
      return [];
    }

    const compiledRestaurantsList = {};

    const initialFetch = await extractData(cityURL);
    compiledRestaurantsList.totalPages = initialFetch.totalPages;
    compiledRestaurantsList.restaurantCards = [...initialFetch.restaurantCards];
    compiledRestaurantsList.restaurantUrls = [...initialFetch.restaurantUrls];
    for (
      let pageNumber = 2;
      pageNumber <= initialFetch.totalPages;
      pageNumber++
    ) {
      const getCityData = await extractData(cityURL, pageNumber);
      compiledRestaurantsList.restaurantCards = [
        ...compiledRestaurantsList.restaurantCards,
        ...getCityData.restaurantCards,
      ];
      compiledRestaurantsList.restaurantUrls = [
        ...compiledRestaurantsList.restaurantUrls,
        ...getCityData.restaurantUrls,
      ];
    }

    return compiledRestaurantsList;
  } catch (error) {
    console.error(
      `Stuff went wrong with getRestaurantListData, error: ${error}`,
    );
  }
};
