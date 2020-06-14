const fs = require('fs');
const mysql = require('mysql');

const configPath = './config/db.json';

if (!fs.existsSync(configPath)) {
    console.error('Failed to open', configPath)
    process.exit(1);
}

const dbConf = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }));

/** @type mysql.Pool */
const pool = mysql.createPool(dbConf);

module.exports = pool;