// File: db.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'MyStatsBetaNodeJS',
    connectionLimit: 5
});

module.exports = pool;