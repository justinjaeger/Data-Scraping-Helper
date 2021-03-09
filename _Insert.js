const InsertionScript = require('./scripts/InsertionScript');

const scripts = {
  AMPAS_BP: () => InsertionScript(require('./outputs/AMPAS_BP.json')),
};

const runAllScripts = () => {
  Object.values(scripts).forEach(async script => {
    await script();
  });
};

// runAllScripts();
scripts.AMPAS_BP();