const HandleQuery = require('./HandleQuery')

module.exports = (awardsShow, category) => {

  console.log(`Deleting Categry ${category} in ${awardsShow}
  `);

  const sql = `
    DELETE FROM nominees
    WHERE awardsShow='${awardsShow}'
    AND category='${category}'
  `;
  return HandleQuery(sql);
};