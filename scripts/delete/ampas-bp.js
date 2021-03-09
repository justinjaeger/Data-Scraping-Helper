const AMPAS_BP_SCRAPE = () => { return require('../scrape/ampas-bp-promise'); }; // bc it's a promise it will immediately invoke it
const AMPAS_BP_DATA = require('../../outputs/AMPAS_BP.json');

const InsertionScript = require('../InsertionScript');
const GetIdsScript = require('../GetIdsScript');
const DeleteScript = require('../DeleteScript');

const deleteDataAndUpdate = async () => {

  console.log('1')

  // GET an array of record IDs
  let arrayOfIds;
  await GetIdsScript('AND(AwardsShow="AMPAS", Category="Best Picture")')
    .then(data => { console.log('record result:',data), arrayOfIds = data; })
    .catch(err => console.log('record error:',err))
  
  console.log('2', arrayOfIds)

  // DELETE all records by ID
  await DeleteScript(arrayOfIds)
    .then(data => console.log('delete result:',data))
    .catch(err => console.log('delete error:',err))

  console.log('3')

  // SCRAPE table
  await AMPAS_BP_SCRAPE()
    .then(res => console.log('scrape result:', res))
    .catch(err => console.log('scrape error:', err))
  
  console.log('4')

  // INSERT data into airtable
  await InsertionScript(AMPAS_BP_DATA)
    .then(res => console.log('insertion result:', res))
    .catch(err => console.log('insertion error:', err))

  console.log('All done')
};

deleteDataAndUpdate();

// module.exports = deleteDataAndUpdate;

