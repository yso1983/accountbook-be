const mariadb = require('mysql');

const db = mariadb.createConnection({
    //host: '132.226.16.13',
    host: 'localhost',
    user: 'yso1983',
    password: '123456',
    database: 'accountbook',
    connectionLimit: 5
});

module.exports = db;