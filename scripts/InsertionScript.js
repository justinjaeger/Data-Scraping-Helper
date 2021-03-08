require('dotenv').config()
const Airtable = require('airtable');

// Create base with Airtable credentials
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.TEST_BASE_ID);

const insertRecordBatch = async (batch) => {
  // output is just for console logging
  const output = [];
  await base('Nominees')
    // Inserts "batch" array of records into the database
    .create(batch, (err, records) => {
      if (err) console.log('err',err)
      else {
        records.forEach(record => {
          output.push(record.fields.Nominee);
        });
        console.log(output);
      };
    });
};

const asyncInsertRecords = async (data) => {
  // Initialize indicies for loop range
  let start=0, end=10;
  while (start < data.length) {
    // Create batch
    let batch = [];
    for (let i=start; i<end; i++) {
      if (data[i]) batch.push(data[i]);
    };
    // Insert batch into Airtable
    await insertRecordBatch(batch)
    // Reset for next batch
    batch = [], start+=10, end+=10;
  };
};

module.exports = asyncInsertRecords;

