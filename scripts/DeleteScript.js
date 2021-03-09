require('dotenv').config()
const Airtable = require('airtable');

/**
 * Exports a function that takes a massive data object
 * Batches the data and asynchronously inserts batches into Airtable
 * Completely universal
 */

// Create base with Airtable credentials
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.TEST_BASE_ID);

/**
 * Exports a promise
 * Takes an array of Ids
 * Deletes in batches
 */
const deleteRecordBatch = async (batch) => {
  return new Promise( async (resolve, reject) => {
    await base('Nominees')
      // Inserts "batch" array of records into the database
      .destroy(batch, function(err, records) {
        if (err) reject(err)
        else {
          resolve(`Removed ${records.length} records.`);
        };
      });
  });
};

const asyncDeleteRecords = async (data) => {
  return new Promise( async (resolve) => {
    // Initialize indicies for loop range
    let start=0, end=10;
    while (start < data.length) {
      // Create batch
      let batch = [];
      for (let i=start; i<end; i++) {
        if (data[i]) batch.push(data[i]);
      };
      // Insert batch into Airtable
      await deleteRecordBatch(batch)
        .then(res => console.log(res))
      // Reset for next batch
      batch = [], start+=10, end+=10;
    };
    resolve('done');
  });
};

module.exports = asyncDeleteRecords;

