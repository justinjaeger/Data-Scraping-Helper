require('dotenv').config()
const Airtable = require('airtable');

/**
 * Exports a function that returns an array of record Ids
 * Takes a formula as an argument to instruct which records to grab
 */

// Create base with Airtable credentials
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.TEST_BASE_ID);

// Create array of record IDs to delete
const getRecordIds = (formula) => {
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

module.exports = getRecordIds;

