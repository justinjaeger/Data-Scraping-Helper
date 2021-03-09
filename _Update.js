const refs = require('./__refs');
const UpdateScript = require('./scripts/UpdateScript');

module.exports = {
  AMPAS_PICTURE: () => UpdateScript(refs.AMPAS_PICTURE).then(d=>console.log(d)).catch(e=>console.log(e)),
  PGA_PICTURE: () => UpdateScript(refs.PGA_PICTURE).then(d=>console.log(d)).catch(e=>console.log(e)),
};
