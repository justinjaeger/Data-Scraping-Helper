const refs = require('./__refs');
const InsertionScript = require('./scripts/InsertionScript');

module.exports = {
  AMPAS_PICTURE: () => InsertionScript(refs.AMPAS_PICTURE.data).then(d=>console.log(d)).catch(e=>console.log(e)),
};
