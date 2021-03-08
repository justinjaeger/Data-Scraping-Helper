const scripts = {
  AMPAS_BP: () => require('./scripts/scrape/ampas-bp')(),
};

const runAllScripts = () => {
  Object.values(scripts).forEach(async script => {
    await script();
  });
};

// runAllScripts();
scripts.AMPAS_BP();