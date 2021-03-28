const puppeteer = require('puppeteer');
const fs = require('fs')

const scrape = (awardsShow, category, url, subcategory) => {

  if (!subcategory) subcategory = null;

  console.log(`Scraping fresh data for ${awardsShow} ${category}...`);
  
  return new Promise( async (resolve, reject) => {
    // Launch headless browser and await page/DOM load
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil : 'domcontentloaded' });

    // select all tables
    const recordList = await page.$$eval('table.wikitable', (decades) => {
      const rowList = [];
      // loop through all tables
      decades.forEach(decade => {
        // filter out the non-decade tables
        let firstHeader = decade.querySelectorAll('th')[0];
        if (!firstHeader || firstHeader.innerText !== 'Year') return;

        let year = '';
        // select all of the rows in decade table
        const rows = Array.from(decade.querySelectorAll('tbody tr'))
        // loop through each row
        rows.forEach(row => {
          // if row is header, skip it
          if (row.querySelector('tr th')) { return; }
          
          const record = {
            'AwardsShow': awardsShow,
            'Year': year,
            'Category': category,
            'Subcategory': subcategory,
            'Film': null,
            'Nominee': null,
            'Winner': 0,
          };
          // get all of the columns in the row
          let columns = Array.from(row.querySelectorAll('tr td'));
          if(row.querySelector('tr th')) {
            year = row.querySelector('tr th').innerText.slice(0,4);
            record['Year'] = year;
          }
          // loop through the columns
          columns.forEach(col => {
            // Fill the Nominee field if empty, since we come across that first (also do the winner field why not)
            if(winner === 0 && col.querySelector('td > b')){
              winner = 1;
              record['Winner'] = winner;
              // console.log('winner marked: ', winner)
            } 
            if (!nominee) {
              // remove parenthetical, if it's there, and add it as a subcategory;
              nominee = col.innerText.replace(/'/g, "''");
              if (nominee.includes('(')) {
                let end = nominee.indexOf('(')
                let parenthetical = nominee.slice(end + 1, -1);
                subcategory = parenthetical;
                record['Subcategory'] = subcategory;
                nominee = nominee.slice(0, end - 2);
              }
              record['Nominee'] = nominee;
            // If Nominee has been filled, take care of the Film field
            } else if (!film){
              // Add the film category
              let currFilm = col.innerText;
              film = currFilm;
              record['Film'] = film;
              // deep clone the object
              const deepClone = JSON.parse(JSON.stringify(record));
              // console.log('deepClone: ', deepClone);
              // console.log('record: ', record);
              rowList.push(deepClone);
            };
          })
        })
      })
      return rowList;
    });

    // browser.close();

    // Store output ((null, 2) argument is for readability purposes)
    fs.writeFile(`outputs/${awardsShow}_${category}.json`, JSON.stringify(recordList, null, 2), err => {
      if(err) reject(err);
      else resolve('Saved Successfully!')
    });
  });  
};

// module.exports = scrape;
scrape('AMPAS', 'director', 'https://en.wikipedia.org/wiki/Academy_Award_for_Best_Director')
