const fs = require('fs');
const {
  getRestaurantData,
} = require('../services/cheerio/get_restaurant_data');

const restaurantPageURL =
  'https://www.swiggy.com/restaurants/crunchy-fast-food-centre-adilabad-city-adilabad-529171';

getRestaurantData(restaurantPageURL)
  .then((restaurantMenuData) => {
    const dir = './dist';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFile(
      'dist/restaurant_menu_data.json',
      JSON.stringify(restaurantMenuData),
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
