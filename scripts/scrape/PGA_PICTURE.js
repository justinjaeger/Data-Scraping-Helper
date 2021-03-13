const puppeteer = require('puppeteer');
const fs = require('fs')

const scrape = () => {

  console.log('Scraping fresh data for PGA_PICTURE...');
  
  return new Promise( async (resolve, reject) => {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    /*******/
    const url = 'https://en.wikipedia.org/wiki/Producers_Guild_of_America_Award_for_Best_Theatrical_Motion_Picture';
    await page.goto(url, { waitUntil : 'domcontentloaded' });
    // select all the decade tables
    let decadeTableSelector = 'table.wikitable[width="80%"]';
    const recordList = await page.$$eval(decadeTableSelector, (decades) => {
      const rowList = [];
      // loop through all the decade tables
      decades.forEach(decade => {
        let year = '';
        // select all of the rows in decade table
        const rows = Array.from(decade.querySelectorAll('tr'))
        // loop through each row
        rows.forEach(row => {
          // if row is header, skip it
          if (row.querySelector('tr th')) { return; }
          // if not, instantiate a record
          const record = {
            'AwardsShow': 'PGA',
            'Year': year,
            'Category': 'Best Picture',
            'Subcategory': null,
            'Film': null,
            'Nominee': null,
            'Winner': null
          };
          // get all of the columns in the row
          let columns = Array.from(row.querySelectorAll('tr td'));
          // loop through the columns
          columns.forEach(col => {
            // if column has text-align: center, we know it's a year. Set the year & return
            if (col.matches('td[style*="text-align:center"]')) {
              year = row.querySelector('tr td').innerText.slice(0,4);
              record['Year'] = year;
              return;
            } 
            // if not a year column...
            else {
              // Fill the Film field if empty, since we come across that first (also do the winner field why not)
              if (!record['Film']) {
                record['Film'] = col.innerText.replace(/'/g, "''");
                record['Winner'] = col.matches('tr[style*="background:#FAEB86"]') ? 1 : 0;
              // If Film has been filled, take care of the 'producers' / 'Nominee' field
              } else {
                // Iterate through each producer and push a record for each one
                let producers = col.innerText;
                let nominees = producers.split(/, and | and |, /);
                nominees.forEach(nominee => {
                  record['Nominee'] = nominee.replace(/'/g, "''");
                  // deep clone the object
                  const deepClone = JSON.parse(JSON.stringify(record));
                  rowList.push(deepClone);
                });
              };
            };
          })
        })
      })
      return rowList;
    });

    browser.close();

    // Store output ((null, 2) argument is for readability purposes)
    fs.writeFile('outputs/PGA_PICTURE.json', JSON.stringify(recordList, null, 2), err => {
      if(err) reject(err);
      else resolve('Saved Successfully!')
    });
  });  
};

module.exports = scrape;
