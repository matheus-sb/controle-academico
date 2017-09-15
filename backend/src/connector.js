var knex = require('knex');
var knexfile = require('../knexfile');

module.exports = knex(knexfile[process.env.NODE_ENV || 'development']);