require('dotenv').config()
const Airtable = require('airtable');
module.exports = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.TEST_BASE_ID);