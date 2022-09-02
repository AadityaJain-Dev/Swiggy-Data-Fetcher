const fs = require('fs');
const {
  getRestaurantListData,
} = require('../services/cheerio/get_restaurant_list');

const cityURL = 'https://www.swiggy.com/city/delhi';

getRestaurantListData(cityURL)
  .then((restaurantListData) => {
    const dir = './dist';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFile(
      'dist/restaurant_list_data.json',
      JSON.stringify(restaurantListData),
      (err) => {
        if (err) {
          console.error('error while writing cities_info file');
          return;
        }
        //file written successfully
      },
    );
  })
  .catch((error) => {
    console.error(
      `Stuff went wrong with extract_all_cities_data.js, error: ${error}`,
    );
  });
