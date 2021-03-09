const base = require('../base');

/**
 * Creates array of record IDs 
 * Determines which ones to get via formula filter
 * @param {String} formula 
 * @returns {Promise}
 */

// Create array of record IDs to delete
module.exports = (formula) => {
  
  console.log('Getting record IDs...')
  
  return new Promise( async (resolve, reject) => {
    const output = [];
    base('Nominees')
      .select({
        view: "Grid view",
        filterByFormula: formula,
      })
      // each page is 100 records
      .eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(record => {
          // push the ID to the output
          output.push(record.getId());
        });
        // Fetch the next page of records
        fetchNextPage();
      }, function done(err) {
          if (err) reject(err)
          else resolve(output);
      });
  });
};
