const InsertScript = require('./scripts/InsertScript');
const DeleteScript = require('./scripts/DeleteScript');
const UpdateScript = require('./scripts/UpdateScript');

/**
 * scrape: opens up browser, scrapes data into 
 *         .json file /outputs folder
 * insert: converts .json file to sql query and 
 *         writes to the database
 * delete: deletes that show/category from database
 * update: does all of the above in sequence
 */

module.exports = {
  AMPAS_PICTURE: {
    scrape: () => require('./scripts/scrape/AMPAS_PICTURE.js')(),
    insert: () => InsertScript(require('./outputs/AMPAS_PICTURE.json')),
    delete: () => DeleteScript('AMPAS', 'Best Picture'),
    update: () => UpdateScript(
      require('./scripts/scrape/AMPAS_PICTURE.js'),
      'AMPAS', 'Best Picture', 
      require('./outputs/AMPAS_PICTURE.json')
    )
  },
  // AMPAS_DIRECTOR: {
  //   data:     () => require('./outputs/AMPAS_DIRECTOR.json'),
  //   script:   require('./scripts/scrape/AMPAS_DIRECTOR.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.director}")`,
  // },
  // AMPAS_ACTOR: {
  //   data:     () => require('./outputs/AMPAS_ACTOR.json'),
  //   script:   require('./scripts/scrape/AMPAS_ACTOR.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.actor}")`,
  // },
  // AMPAS_ACTRESS: {
  //   data:     () => require('./outputs/AMPAS_ACTRESS.json'),
  //   script:   require('./scripts/scrape/AMPAS_ACTRESS.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.actress}")`,
  // },
  // AMPAS_SUPP_ACTOR: {
  //   data:     () => require('./outputs/AMPAS_SUPP_ACTOR.json'),
  //   script:   require('./scripts/scrape/AMPAS_SUPP_ACTOR.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.supp_actor}")`,
  // },
  // AMPAS_SUPP_ACTRESS: {
  //   data:     () => require('./outputs/AMPAS_SUPP_ACTRESS.json'),
  //   script:   require('./scripts/scrape/AMPAS_SUPP_ACTRESS.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.supp_actress}")`,
  // },
  // AMPAS_ANIMATED: {
  //   data:     () => require('./outputs/AMPAS_ANIMATED.json'),
  //   script:   require('./scripts/scrape/AMPAS_ANIMATED.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.animated}")`,
  // },
  // AMPAS_ANIMATED_SHORT: {
  //   data:     () => require('./outputs/AMPAS_ANIMATED_SHORT.json'),
  //   script:   require('./scripts/scrape/AMPAS_ANIMATED_SHORT.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.animated_short}")`,
  // },
  // AMPAS_CINEMATOGRAPHY: {
  //   data:     () => require('./outputs/AMPAS_CINEMATOGRAPHY.json'),
  //   script:   require('./scripts/scrape/AMPAS_CINEMATOGRAPHY.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.cinematography}")`,
  // },
  // AMPAS_COSTUME: {
  //   data:     () => require('./outputs/AMPAS_COSTUME.json'),
  //   script:   require('./scripts/scrape/AMPAS_COSTUME.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.costume}")`,
  // },
  // AMPAS_DOCUMENTARY: {
  //   data:     () => require('./outputs/AMPAS_DOCUMENTARY.json'),
  //   script:   require('./scripts/scrape/AMPAS_DOCUMENTARY.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.documentary}")`,
  // },
  // AMPAS_DOCUMENTARY_SHORT: {
  //   data:     () => require('./outputs/AMPAS_DOCUMENTARY_SHORT.json'),
  //   script:   require('./scripts/scrape/AMPAS_DOCUMENTARY_SHORT.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.documentary_short}")`,
  // },
  // AMPAS_EDITING: {
  //   data:     () => require('./outputs/AMPAS_EDITING.json'),
  //   script:   require('./scripts/scrape/AMPAS_EDITING.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.editing}")`,
  // },
  // AMPAS_INTERNATIONAL: {
  //   data:     () => require('./outputs/AMPAS_INTERNATIONAL.json'),
  //   script:   require('./scripts/scrape/AMPAS_INTERNATIONAL.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.international}")`,
  // },
  // AMPAS_LIVE_ACTION_SHORT: {
  //   data:     () => require('./outputs/AMPAS_LIVE_ACTION_SHORT.json'),
  //   script:   require('./scripts/scrape/AMPAS_LIVE_ACTION_SHORT.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.live_action_short}")`,
  // },
  // AMPAS_MAKEUP: {
  //   data:     () => require('./outputs/AMPAS_MAKEUP.json'),
  //   script:   require('./scripts/scrape/AMPAS_MAKEUP.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.makeup}")`,
  // },
  // AMPAS_SCORE: {
  //   data:     () => require('./outputs/AMPAS_SCORE.json'),
  //   script:   require('./scripts/scrape/AMPAS_SCORE.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.score}")`,
  // },
  // AMPAS_SONG: {
  //   data:     () => require('./outputs/AMPAS_SONG.json'),
  //   script:   require('./scripts/scrape/AMPAS_SONG.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.song}")`,
  // },
  // AMPAS_PRODUCTION_DESIGN: {
  //   data:     () => require('./outputs/AMPAS_PRODUCTION_DESIGN.json'),
  //   script:   require('./scripts/scrape/AMPAS_PRODUCTION_DESIGN.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.production_design}")`,
  // },
  // AMPAS_SOUND: {
  //   data:     () => require('./outputs/AMPAS_SOUND.json'),
  //   script:   require('./scripts/scrape/AMPAS_SOUND.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.sound}")`,
  // },
  // AMPAS_VISUAL_EFFECTS: {
  //   data:     () => require('./outputs/AMPAS_VISUAL_EFFECTS.json'),
  //   script:   require('./scripts/scrape/AMPAS_VISUAL_EFFECTS.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.visual_effects}")`,
  // },
  // AMPAS_ADAPTED_SCREENPLAY: {
  //   data:     () => require('./outputs/AMPAS_ADAPTED_SCREENPLAY.json'),
  //   script:   require('./scripts/scrape/AMPAS_ADAPTED_SCREENPLAY.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.adapted_screenplay}")`,
  // },
  // AMPAS_ORIGINAL_SCREENPLAY: {
  //   data:     () => require('./outputs/AMPAS_ORIGINAL_SCREENPLAY.json'),
  //   script:   require('./scripts/scrape/AMPAS_ORIGINAL_SCREENPLAY.js'),
  //   formula:  `AND(AwardsShow="AMPAS", Category="${c.original_screenplay}")`,
  // },
  PGA_PICTURE: {
    scrape: () => require('./scripts/scrape/PGA_PICTURE.js')(),
    insert: () => InsertScript(require('./outputs/PGA_PICTURE.json')),
    delete: () => DeleteScript('PGA', 'Best Picture'),
    update: () => UpdateScript(
      require('./scripts/scrape/PGA_PICTURE.js'),
      'PGA', 'Best Picture', 
      require('./outputs/PGA_PICTURE.json')
    )
  },
  // PGA_ANIMATED: {
  //   data:     () => require('./outputs/PGA_ANIMATED.json'),
  //   script:   require('./scripts/scrape/PGA_ANIMATED.js'),
  //   formula:  `AND(AwardsShow="PGA", Category="${c.animated}")`,
  // },
  // PGA_DOCUMENTARY: {
  //   data:     () => require('./outputs/PGA_PICTURE.json'),
  //   script:   require('./scripts/scrape/PGA_PICTURE.js'),
  //   formula:  `AND(AwardsShow="PGA", Category="${c.documentary}")`,
  // },
};