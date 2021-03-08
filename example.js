const puppeteer = require('puppeteer');
const fs = require('fs')

const scrape = async () => {
  // browser initiate
  const browser = await puppeteer.launch({headless : false});
  // open a new blank page
  const page = await browser.newPage();
  // go to following page. wait until dom is loaded
  const url = 'https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory';
  await page.goto(url, { waitUntil : 'domcontentloaded' });

  // Select table by aria-label (instead of div id)
  const selector = '[aria-label="COVID-19 pandemic by country and territory table"] table#thetable tbody tr';
  const recordList = await page.$$eval(selector, (trows) => {
    // trows is an array of all the rows
    // loop through all rows in the table (every row is <tr>stuff</tr>)
    // populate rowList with all of the records
    let rowList = []
    trows.forEach(row => {
      // Create a record for each row
      const record = {
        country : '',
        cases :'', 
        death : '', 
        recovered :'',
      };
      // Assign each property in record
      // (tr < th < a) anchor tag text contains country name
      record.country = row.querySelector('a').innerText;
      // Select all <td>s in the row, which accuonts for the rest of the columns
      // getting textvalue of each column of a row and adding them to a list.
      // Array.from() creates new shallow-copy array
        // second arg takes value at each indicies and says do this to it
      const tdList = Array.from(row.querySelectorAll('td'), column => column.innerText);
      record.cases = tdList[0];        
      record.death = tdList[1];       
      record.recovered = tdList[2];   
      // need conditional so it doesn't push the column header
      if (tdList.length >= 3){  
        rowList.push(record);
      };
    });
    return rowList;
  })
  console.log('record List',recordList)
  
  browser.close();

  // Store output ((null, 2) argument is for readability purposes)
  fs.writeFile('covid-19.json', JSON.stringify(recordList, null, 2), err => {
    if(err){console.log(err)}
    else{console.log('Saved Successfully!')}
  });
};
scrape();
