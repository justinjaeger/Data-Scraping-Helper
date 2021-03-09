const refs = require('./__refs');

module.exports = {
  AMPAS_PICTURE: () => refs.AMPAS_PICTURE.script().then(d=>console.log(d)).catch(e=>console.log(e)),
};
