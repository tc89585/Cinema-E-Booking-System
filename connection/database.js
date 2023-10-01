const {createPool} = require('mysql');

const pool = createPool({
    host:"localhost",
    user:"root",
    password: "Messi2210",
    database: "cinema-ebooking",
    connectionLimit: 10
});

pool.query(`SELECT * from movies`, (err, result, fields) => {
    if (err) {
        return console.log(err);
    }
    return console.log(result);
});
