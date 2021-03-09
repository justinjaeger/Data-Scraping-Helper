const puppeteer = require('puppeteer');
const fs = require('fs')

/**
 * Returns a promise that scrapes the AMPAS Best Picture Wiki page
 * Outputs to AMPAS_BP.json
 */

const scrape = new Promise( async (resolve, reject) => {
  // browser initiate
  const browser = await puppeteer.launch({headless : false});
  // open a new blank page
  const page = await browser.newPage();
  // go to following page. wait until dom is loaded
  const url = 'https://en.wikipedia.org/wiki/Academy_Award_for_Best_Picture';
  await page.goto(url, { waitUntil : 'domcontentloaded' });

  // select all the decade tables
  let selector = 'table[style*="width:100%"].wikitable';
  const recordList = await page.$$eval(selector, (decades) => {
    const rowList = [];
    // loop through all the decade tables
    decades.forEach(decade => {
      let year = '';
      // select all of the rows in decade table
      const rows = Array.from(decade.querySelectorAll('tr'))
      // loop through each row
      rows.forEach(row => {
        // return if row is header
        if (row.querySelector('tr th')) { return; }
        // change year and return if row is a year
        else if (row.querySelector('tr td[rowspan]')) {
          year = row.querySelector('tr td b a').innerHTML;
          if (year.length > 4) {
            year = year.slice(0, 2) + year.slice(5)
          };
          return;
        } 
        else {
          const record = {
            'fields': {
              'AwardsShow': 'AMPAS',
              'Year': year,
              'Category': 'Best Picture',
              'Film': null,
              'Nominee': null,
              'Winner': null
            }
          };
          let columns = Array.from(row.querySelectorAll('tr td'));
          record.fields['Film'] = columns[0].innerText;
          record.fields['Winner'] = row.matches('tr[style*="background:#FAEB86"]') ? 'true' : 'false';
          // Determine how many nominees there are and push a record per nominee
          // separate by ' and ' and ', '
          let producers = columns[1].innerText;
          let nominees = producers.split(/, and | and |, /);
          nominees.forEach(nominee => {
            record.fields['Nominee'] = nominee;
            // deep clone the object
            const deepClone = JSON.parse(JSON.stringify(record));
            rowList.push(deepClone);
          })
        };
      })
    })
    return rowList;
  });

  browser.close();

  // Store output ((null, 2) argument is for readability purposes)
  fs.writeFile('outputs/AMPAS_BP.json', JSON.stringify(recordList, null, 2), err => {
    if(err){
      console.log(err);
      reject(err);
    } else {
      console.log('Saved Successfully!')
      resolve('Saved Successfully!')
    };
  });
});  

module.exports = scrape;
