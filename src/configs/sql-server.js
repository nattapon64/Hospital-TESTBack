const mysql = require('mysql2')

const connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'Strongpassword1',
    database: 'hospital',
});

module.exports = connection