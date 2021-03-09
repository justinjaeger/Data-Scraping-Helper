const refs = require('./__refs');
const DeleteScript = require('./scripts/DeleteScript');

module.exports = {
  AMPAS_PICTURE: () => DeleteScript(refs.AMPAS_PICTURE.formula).then(d=>console.log(d)).catch(e=>console.log(e)),
  PGA_PICTURE: () => DeleteScript(refs.PGA_PICTURE.formula).then(d=>console.log(d)).catch(e=>console.log(e)),
};
