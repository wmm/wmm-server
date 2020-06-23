const mysql = require('mysql');

const config = require('./config/db.json');

/** @type mysql.Pool */
const pool = mysql.createPool(config);

module.exports = pool;