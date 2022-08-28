const cheerio = require('cheerio');
const axiosFunctions = require('../axios/');

/**
 * This function fetches html page which contain all cities names from swiggy.
 * extract the city info from HTML & put it in an object
 * push the object to citiesList array
 * @param {String} citiesPageURL - The URL for the page which contains cities data
 * @returns {Array} citiesList - This object will have Cities name & HREF
 */

exports.getAllCitiesData = async (citiesPageURL) => {
  try {
    if (!citiesPageURL) {
      return [];
    }
    const html = await axiosFunctions.simpleGetReq(citiesPageURL);
    const $ = cheerio.load(html);
    const citiesContainer = $('#city-links ul > li').contents();
    let citiesList = [];

    citiesContainer.each(function () {
      const cityData = {};
      cityData.href = $(this).attr('href');
      cityData.name = $(this).text();
      citiesList.push(cityData); //TODO: add cities ids also
    });
    return citiesList;
  } catch (error) {
    console.error(`Stuff went wrong with getAllCitiesData, error: ${error}`);
  }
};
