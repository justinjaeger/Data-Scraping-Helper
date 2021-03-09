const InsertionScript = require('./InsertionScript');
const DeleteScript = require('./DeleteScript');

/**
 * Deletes data via obj.formula and populates table with fresh data
 * @param {Object} obj 
 * @returns {Promise} 
 */

module.exports = async (obj) => {
  const { data, script: ScrapeScript, formula } = obj;
  return new Promise( async (resolve) => {

    console.log('(1/4)')

    // DELETE all records by ID
    await DeleteScript(formula)
      .then(data => console.log(data))
      .catch(err => console.log('delete error:',err))

    console.log('(2/4)')

    // SCRAPE table
    await ScrapeScript()
      .then(res => console.log(res))
      .catch(err => console.log('scrape error:', err))
    
    console.log('(3/4)')

    // INSERT data into airtable
    await InsertionScript(data)
      .then(res => console.log(res))
      .catch(err => console.log('insertion error:', err))

    resolve('(4/4) All done!');
  });
}; 
