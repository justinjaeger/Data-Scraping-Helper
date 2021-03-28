const puppeteer = require('puppeteer');
const fs = require('fs')

const scrape = () => {

  console.log('Scraping fresh data for AMPAS DIRECTOR...');
  
  return new Promise( async (resolve, reject) => {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    /*******/
    const url = 'https://en.wikipedia.org/wiki/Academy_Award_for_Best_Director';
    await page.goto(url, { waitUntil : 'domcontentloaded' });
    // select all the decade tables
    let decadeTableSelector = 'table.wikitable';
    const recordList = await page.$$eval(decadeTableSelector, (decades) => {
      const rowList = [];
      // loop through all the decade tables
      decades.forEach(decade => {
        // if the given table is the page's legend, skip it
        if(decade.querySelector('div.legend')) return;
        // console.log('wikitable.tbody?: ', decade.querySelector('tbody'));
        let era = 0;
        if(decade.querySelector('tbody tr td[data-sort-value*="ω"]')){
          era = decade.querySelector('tbody tr td[data-sort-value*="ω"]').innerText.slice(0,4);
          // console.log(era);
        }
        let year = '';
        // select all of the rows in decade table
        const rows = Array.from(decade.querySelectorAll('tbody tr'))
        // loop through each row
        rows.forEach(row => {
          // console.log(row.querySelector('td') ? 'This is indeed a row' : 'Nah, bud');
          let subcategory = null;
          let film = null;
          let nominee = null;
          let winner = 0;
          const record = {
            'AwardsShow': 'AMPAS',
            'Year': year,
            'Category': 'Best Director',
            'Subcategory': subcategory,
            'Film': film,
            'Nominee': nominee,
            'Winner': winner
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

    browser.close();

    // Store output ((null, 2) argument is for readability purposes)
    fs.writeFile('outputs/AMPAS_DIRECTOR.json', JSON.stringify(recordList, null, 2), err => {
      if(err) reject(err);
      else resolve('Saved Successfully!')
    });
  });  
};

module.exports = scrape;
