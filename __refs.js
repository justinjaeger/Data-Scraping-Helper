module.exports = {
  AMPAS_PICTURE: {
    data: require('./outputs/AMPAS_PICTURE.json'),
    script: require('./scripts/scrape/AMPAS_PICTURE.js'),
    formula: 'AND(AwardsShow="AMPAS", Category="Best Picture")',
  },
};