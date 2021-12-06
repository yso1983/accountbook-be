const mariadb = require('mysql');

const db = mariadb.createConnection({
    host: process.env.DB_CONN_HOST,
    user: process.env.DB_CONN_USER,
    password: process.env.DB_CONN_PASSWORD,
    database: process.env.DB_CONN_DATABASE,
    connectionLimit: 5
});

module.exports = db;