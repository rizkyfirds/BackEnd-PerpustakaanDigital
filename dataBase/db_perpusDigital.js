var mysql = require('mysql2');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "digital_perpustakaan"
});

module.exports = db;