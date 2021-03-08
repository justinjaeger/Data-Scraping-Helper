const puppeteer = require('puppeteer');
const fs = require('fs')

const scrape = async () => {
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
        if (row.querySelector('tr th')) return
        // change year and return if row is year
        else if (row.querySelector('tr td[rowspan]')) {
          year = row.querySelector('tr td b a').innerHTML;
          if (year.length > 4) {
            year = year.slice(0, 2) + year.slice(5)
          };
          return;
        } 
        else {
          const record = {
            'Year': year,
            'Film': '',
            // 'Producer(s)': '',
            'Winner': false,
          };
          let columns = Array.from(row.querySelectorAll('tr td'));
          record['Film'] = columns[0].innerText;
          // record['Producer(s)'] = columns[1].innerText;
          record['Winner'] = row.matches('tr[style*="background:#FAEB86"]');
          rowList.push(record);
        };
      })
    })
    return rowList;
  });
  browser.close();

  // Store output ((null, 2) argument is for readability purposes)
  fs.writeFile('../JSON_output/AMPAS-BestPicture.json', JSON.stringify(recordList, null, 2), err => {
    if(err){console.log(err)}
    else{console.log('Saved Successfully!')}
  });
};  
  // browser.close();

scrape();