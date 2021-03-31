const puppeteer = require('puppeteer');
const fs = require('fs')

// Change: made subcategory a default param since you were effectively doing that already
const scrape = (awardsShow, category, url, subcategory = null) => {

  console.log(`Scraping fresh data for ${awardsShow} ${category}...`);
  
  return new Promise( async (resolve, reject) => {
    // Launch headless browser and await page/DOM load
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil : 'domcontentloaded' });
    
    // select all tables
    // How do we access variables declared outside inside this func? 
    const recordList = await page.$$eval('table.wikitable', (decades, awardsShow, category, subcategory = null) => {
      const rowList = [];
      let nomCol = null; 
      let filmCol = null;
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
          let film = null;
          let nominee = null;
          subcategory = null;
          let winner = 0;
    
          // select all the inner text from the row. 
          const rowText = row.innerText;
          const record = {
            'AwardsShow': awardsShow,
            'Year': year,
            'Category': category,
            'Subcategory': subcategory,
            'Film': film,
            'Nominee': nominee,
            'Winner': winner,
          };
          //if the first two digits of the rowtext are '19' or '20' and the rowtext doesn't include 's' that's the year
          if (((`${rowText[0]}${rowText[1]}` == '19' || `${rowText[0]}${rowText[1]}` == '20') && !(rowText[4] && rowText[4] === 's'))) { 
            year = rowText.slice(0, 4);
            console.log(year);
            record['Year'] = year;
          }
          // if the row says 'Year', it's the key
          else if ((!filmCol || !nomCol) && rowText.includes('Year')){
            // make an array;
            const headerArr = Array.from(row.querySelectorAll('th'))
            for (let i = 0; i < headerArr.length; i += 1) {
              const cell = headerArr[i];
              // columns are stored as i - 1 because the rows with the actual names won't include the year;
              if(cell.innerText == 'Film'){
                filmCol = i - 1;
              } else if (cell.innerText.includes('(s)')) {
                nomCol = i - 1;
              }
            }
          }
          // otherwise skip the header rows
          else if (row.querySelector('tr th')) { 
            return; 
          }
          // get all of the columns in the row
          let columns = Array.from(row.querySelectorAll('tr td'));
          // loop through the columns
          for(let i = 0; i < columns.length; i++){
            col = columns[i];
            let colText = col.innerText;
            // If the text is bolded, the nominee in this row won;
            if(winner === 0 && col.querySelector('td > b')){
              winner = 1;
              record['Winner'] = winner;
            } 
            // if we're in the column with nominees, add a nominee
            if (!nominee && i === nomCol) {
              nominee = colText.replace(/'/g, "''");
              // remove parenthetical, if it's there, and add it as a subcategory;
              if (nominee.includes('(')) {
                let end = nominee.indexOf('(')
                let parenthetical = nominee.slice(end + 1, -1);
                subcategory = parenthetical;
                record['Subcategory'] = subcategory;
                nominee = nominee.slice(0, end - 2);
              // if there are multiple nominees, seperate them with spaces and a comma
              } else if (nominee.includes(',')) {
                const noms = nominee.split(', ').join();
                nominee = noms;
              }
              record['Nominee'] = nominee;
            // If this is the column with films, add a film
            } else if (!film && i === filmCol) {
              // Add the film category
              let currFilm = colText;
              film = currFilm;
              record['Film'] = film;
              // deep clone the object
              const deepClone = JSON.parse(JSON.stringify(record));
              rowList.push(deepClone);
            };
          };
        });
      })
      return rowList;
    }, awardsShow, category, subcategory);

    browser.close();

    // Store output ((null, 2) argument is for readability purposes)
    fs.writeFile(`outputs/${awardsShow}_${category}.json`, JSON.stringify(recordList, null, 2), err => {
      if(err) reject(err);
      else resolve('Saved Successfully!')
    });
  });  
};

// module.exports = scrape;
scrape('AMPAS', 'director', 'https://en.wikipedia.org/wiki/Academy_Award_for_Best_Director')