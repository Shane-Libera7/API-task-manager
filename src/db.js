const knex = require('knex');
const config = require('../knexfile');

// Initialise DB 
const db = knex(config.development);


//Export DB

module.exports = db;