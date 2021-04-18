const puppeteer = require('puppeteer');
const fs = require('fs')

// Change: made subcategory a default param since you were effectively doing that already
const scrape = (url) => {

  console.log(`Scraping fresh data for ${url}...`);
  
  return new Promise( async (resolve, reject) => {
    // Launch headless browser and await page/DOM load
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil : 'domcontentloaded' });
    
    // Select the question
    const recordList = await page.$$eval('[class^="Question_container"]', (question) => {
      console.log('question');
      const rowList = [];

      // header / subcategory cache
      const nomineesByCategory = {
        'Picture' : ['Film Studio', 'Producer(s)'],
        'Director' : ['Director(s)'],
        'Supporting Actress' : ['Actress'],
        'Supporting Actor' : ['Actor'],        
      }
      // ASSIGN LEGEND (1, 2, 3)
      let nomCol = null; 
      let filmCol = null;

      // 1. Get the first valid decade table
      let r = 0;
      while (!decades[r].querySelector('th') || decades[r].querySelector('th').innerText !== 'Year') {
        r+=1;
      };
      let firstDecade = decades[r];

      // 2. Find out which tr the legend is in and get it
      let legendRow;
      if (firstDecade.querySelector('thead tr th') && firstDecade.querySelector('thead tr th').innerText === 'Year') {
        legendRow = firstDecade.querySelector('thead tr');
        console.log('legend located in head')
      } else {
        legendRow = firstDecade.querySelector('tbody tr');
        console.log('legend located in body')
      };

      // 3. make an array of the headers and iterate through it
      const headerArr = Array.from(legendRow.querySelectorAll('th'));
      // select the array of headers that the current category could be under
      let catArr = nomineesByCategory[category];

      for(let i = 0; i < headerArr.length; i += 1) {
        if (headerArr[i].innerText === 'Film' || headerArr[i].innerText === 'Winner') {
          filmCol = i - 1;
        } else if (catArr.includes(headerArr[i].innerText)) {
          nomCol = i - 1;
        }
      }

      console.log('nom, film', nomCol, filmCol)

      // loop through all tables
      decades.forEach(decade => {
        
        // filter out the non-decade tables
        let firstHeader = decade.querySelector('th');
        if (!firstHeader) return;
        if (firstHeader.innerText !== 'Year') return;

        let year = null;

        // select all of the rows in decade table
        const rows = Array.from(decade.querySelectorAll('tbody tr'))

        // loop through each row
        rows.forEach(row => {

          // select ALL inner text from the row. 
          const rowText = row.innerText;

          // instantiate record
          const record = {
            'AwardsShow': awardsShow,
            'Year': year,
            'Category': category,
            'Subcategory': subcategory,
            'Film': null,
            'Nominee': null,
            'Winner': 0,
          };

          // If row contains the year, update year field
          if ((`${rowText[0]}${rowText[1]}` == '19' || `${rowText[0]}${rowText[1]}` == '20') && !(rowText[4] && rowText[4] === 's')) { 
            year = rowText.slice(0, 4);
            record['Year'] = year;
          };

          // Get array of all (non-year) columns in the row
          let columns = Array.from(row.querySelectorAll('tr td'));

          // Check if valid row
          if (columns.length < 2) return;

          // Initialize these variables. This will make sense below
          let filmColText = null;
          let nomColText = null;

          // We need to do a check that this td is not a year
          // If it is a year, the filmCol and nomCol will actually be one index up, 
          // so we account for that by assigning them
          let first2chars = columns[0].innerText.slice(0,2);
          // If the film TITLE is a year, the last cnditional will fix that cause titles are in italics
          if ((first2chars === '19' || first2chars === '20') && !columns[0].querySelector('td > i')) {
              filmColText = columns[filmCol+1].innerText;
              nomColText = columns[nomCol+1].innerText;
              console.log('YEAR IS A TD');
          };

          // Get text for film and noms columns (if still null / unassigned)
          if (!filmColText) filmColText = columns[filmCol].innerText;
          if (!nomColText) nomColText = columns[nomCol].innerText;

          // Check if winner (aka text is bold)
          if (columns[0].querySelector('td > b') || columns[0].querySelector('td > i > b')) {
            record['Winner'] = 1;
          };

          // Assign film field
          record['Film'] = filmColText.replace(/'/g, "''");;

          // Assign nominee field
          let nominees = nomColText.split(/, and | and |, /);
          nominees.forEach(nominee => {
            record['Nominee'] = nominee.replace(/'/g, "''");
            // shallow copy the object and push to array of records
            const shallowCopy = JSON.parse(JSON.stringify(record));
            rowList.push(shallowCopy);
          });
        });
      });
      return rowList;
    }, url);

    browser.close();

    // Store output ((null, 2) argument is for readability purposes)
    fs.writeFile(`outputs/${url}.json`, JSON.stringify(recordList, null, 2), err => {
      if(err) reject(err);
      else resolve('Saved Successfully!')
    });
  });
};

// module.exports = scrape;
scrape('AMPAS', 'Picture', 'https://en.wikipedia.org/wiki/Academy_Award_for_Best_Picture')
