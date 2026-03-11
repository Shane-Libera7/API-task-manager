const knex = require('knex');
const config = require('../knexfile');
require('dotenv').config();

// Initialise DB 
const env = process.env.NODE_ENV || 'development';
const db = knex(config[env]);


//Export DB

module.exports = db;