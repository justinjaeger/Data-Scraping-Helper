const InsertScript = require('./scripts/InsertScript');
const DeleteScript = require('./scripts/DeleteScript');
const UpdateScript = require('./scripts/UpdateScript');

/**
 * scrape: opens up browser, scrapes data into 
 *         .json file /outputs folder
 * insert: converts .json file to sql query and 
 *         writes to the database
 * delete: deletes that show/category from database
 * update: does all of the above in sequence
 */

module.exports = {
  YAHOO: {
    scrape: () => require('./scripts/scrape/yahoo_scrape.js')(),
    insert: () => InsertScript(require('./outputs/yahoo_scrape.json')),
    // delete: () => DeleteScript('AMPAS', 'Best Picture'),
    // update: () => UpdateScript(
    //   require('./scripts/scrape/AMPAS_PICTURE.js'),
    //   'AMPAS', 'Best Picture', 
    //   require('./outputs/AMPAS_PICTURE.json')
    // )
  }
};