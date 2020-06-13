const fs = require('fs');
const mysql = require('mysql');

if (!fs.existsSync('./config/db.json')) {
    console.error('Failed to open ./config/db.json')
    process.exit(1);
}

const dbConf = JSON.parse(fs.readFileSync('./config/db.json', { encoding: 'utf-8' }));

/** @type mysql.Pool */
const pool = mysql.createPool(dbConf);

module.exports = pool;