const base = require('../base');
const GetIdsScript = require('./GetIdsScript');

/**
 * Batches the data (an array of ids) 
 * and inserts batches into Airtable
 * @param {String} formula 
 * @returns {Promise}
 */

module.exports = async (formula) => {
  
  return new Promise( async (resolve, reject) => {

    // First, get an array of IDs (data)
    let data;
    await GetIdsScript(formula)
      .then(res => { console.log(res), data = res; })
      .catch(err => console.log('record error:',err))

    console.log('Deleting records...')
    
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
    await Promise.all(arrayOfBatches.map(deleteRecordBatch))
      .then(res => resolve('Complete! ', res))
      .catch(err => reject(err))
  });
};

/**
 * Deletes every Id in batch
 * @param {*} batch 
 * @returns {Promise}
 */

const deleteRecordBatch = async (batch) => {
  return new Promise( async (resolve, reject) => {
    await base('Nominees')
      // Inserts "batch" array of records into the database
      .destroy(batch, function(err, records) {
        if (err) reject(err)
        else {
          // console.log(`Removed ${records.length} records.`)
          resolve(`Removed ${records.length} records.`);
        };
      });
  });
};
