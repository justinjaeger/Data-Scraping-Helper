const HandleQuery = require('./HandleQuery')
const InsertScript = require('./InsertScript')

module.exports = async (scrapeScript, awardsShow, category, data) => {
  
  await scrapeScript();

  console.log(`Deleting ${category} in ${awardsShow}...`);

  const sql = `
    DELETE FROM nominees
    WHERE awardsShow='${awardsShow}'
    AND category='${category}'
  `;
  await HandleQuery(sql)

  InsertScript(data);
};