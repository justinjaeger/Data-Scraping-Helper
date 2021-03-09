const Scrape = require('./_Scrape');
const Insert = require('./_Insert');
const Update = require('./_Update');
const Delete = require('./_Delete');

const runScripts = (obj) => {
  Promise.all(Object.values(obj).map((fn, i) => { 
    let l = Object.keys(obj).length;
    console.log(`Executing script (${i+1}/${l})`);
    return fn();
  }))
  .then(() => console.log('Finished!'))
  .catch(err => console.log('Error running all insertion scripts:',err))
};

module.exports = {
  scrape: () => runScripts(Scrape),
  insert: () => runScripts(Insert),
  update: () => runScripts(Update),
  delete: () => runScripts(Delete),
};
