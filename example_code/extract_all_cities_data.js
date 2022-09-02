const fs = require('fs');
const { getAllCitiesData } = require('../services/cheerio/get_all_cities');

const citiesPageURL = 'https://www.swiggy.com/';

getAllCitiesData(citiesPageURL)
  .then((allCitiesData) => {
    const dir = './dist';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFile(
      'dist/cities_info.json',
      JSON.stringify(allCitiesData),
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
