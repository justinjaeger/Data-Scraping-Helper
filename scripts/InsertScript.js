const HandleQuery = require('./HandleQuery');

module.exports = async function writeDataToSQL(DATA) {

  console.log('(1/3) Converting JSON to SQL...')

  const arrayOfBatches = [];

  let start=0, end=20;
  // run this batching until you iterate through AMPAS_PICTURE
  while (start < DATA.length) {
    // make sure that you don't run an operation where i > AMPAS_PICTURE.length
    if (!DATA[end]) end=DATA.length;
    // push 20 SQL queries to batch
    let batch = [];
    for (let i=start; i<end; i++) {
      let record = DATA[i];
      const sql = `
      INSERT INTO nominees 
      (awardsShow, year, category, subcategory, film, nominee, winner)
      VALUES (
        '${record.AwardsShow}', 
        '${record.Year}', 
        '${record.Category}', 
        '${record.Subcategory}', 
        '${record.Film}', 
        '${record.Nominee}', 
          ${record.Winner}
      )`;
      batch.push(sql);
    };
    // push batch to arrayOfBatches and increase batch index limits
    start+=20, end+=20;
    arrayOfBatches.push(batch);
  };

  console.log('(2/3) Writing to database...')

  // Once you have your arrayOfBatches done,
  // pass each batch into handleBatch (below)
  for (let batch of arrayOfBatches) {
    await Promise.all(batch.map(HandleQuery))
      // .then(data => console.log('data',data))
      .catch(err => {console.log('err',err)})
  };

  console.log(`(3/3) Inserted ${DATA.length} rows into nominees.`)
};
