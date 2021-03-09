const base = require('../base');

/**
 * Batches the data 10 at a time and 
 * asynchronously insert batches into Airtable
 * @param {Array} data 
 * @returns {Promise}
 */

module.exports = async (data) => {

  console.log('Inserting records into Airtable...')

  return new Promise( async (resolve, reject) => {
    const arrayOfBatches = [];
    // Initialize indicies for loop range
    let start=0, end=10;
    while (start < data.length) {
      // Create batch
      let batch = [];
      for (let i=start; i<end; i++) {
        if (data[i]) batch.push(data[i]);
      };
      arrayOfBatches.push(batch);
      // Reset for next batch
      batch = [], start+=10, end+=10;
    };
    // Execute all the batches
    await Promise.all(arrayOfBatches.map(insertRecordBatch))
      .then(res => resolve('Complete! ', res))
      .catch(err => reject(err))
  });
};

/**
 * Inserts batch of records into Airtable
 * @param {array} batch 
 * @returns {Promise}
 */

const insertRecordBatch = async (batch) => {
  return new Promise( async (resolve, reject) => {
    // output is just for console logging
    const output = [];
    await base('Nominees')
      // Inserts "batch" array of records into the database
      .create(batch, (err, records) => {
        if (err) reject(err)
        else {
          // console.log(`Inserted ${records.length} records.`);
          resolve(`Inserted ${records.length} records.`);
        };
      });
  });
};
