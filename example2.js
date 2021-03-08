const Airtable = require('airtable');
const covid = require('./covid-19.json');

// API provides FULL ACCESS to do all operations
// Consider createing a read-only one down the road if sharing it
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const TEST_BASE_ID = process.env.TEST_BASE_ID;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(TEST_BASE_ID);

// SELECT operation if you want to list or do something with entries
// This could be how we interface with it via user actions and queries
// https://airtable.com/appWT4nZ9YG4uDKqD/api/docs#javascript/table:table%201:list
const selectTable = new Promise((resolve, reject) => {
  const output = [];
  base('Nominees')
    .select({
      // maxRecords: 2,
      view: "Grid view"
    })
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      // Each PAGE is by default 100 records
      records.forEach(record => {
        output.push(record.fields);
      });
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
      }, function done(err) {
        if (err) reject(err);
        resolve(output);
      });
});

// We are also concerned WRITE / CREATE operations
// Maybe we could just pass in the imported JSON object into this .create function
const createRecords = new Promise((resolve, reject) => {
  const output = [];
  base('Table 1')
    .create([
      {
        "fields": {
          "Nominee": "Riz Ahmed",
          "Movie": "Sound of Metal",
          "Category": "Best Actor"
        }
      },
      {
        "fields": {
          "Nominee": "Paul Raci",
          "Movie": "Sound of Metal",
          "Category": "Best Supporting Actor"
        }
      }
    ], (err, records) => {
      if (err) reject(err);
      records.forEach(record => {
        output.push(record.getId());
      });
      resolve(output);
    });
});

// selectTable
// .then(data => console.log('data', data))
// .catch(err => console.log('err', err));

// createRecords
//   .then(data => console.log('data', data))
//   .catch(err => console.log('err', err));

