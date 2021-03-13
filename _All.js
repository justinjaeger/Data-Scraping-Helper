const Scripts = require('./_Scripts');

const runScripts = (obj) => {
  let l = Object.keys(obj).length;

  // run the update scripts for each award/category
  Promise.all(Object.values(obj).map((scripts, i) => { 
    console.log(`Executing script (${i+1}/${l})`);
    return scripts.update();
  }))
  .then(() => console.log('Finished!'))
  .catch(err => console.log('Error running all insertion scripts:',err))
};

module.exports = () => runScripts(Scripts);
