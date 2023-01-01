const mariadb = require('mariadb');
const  { readFile } = require("fs/promises")

const parseCredentials = async () => {
    const data = await readFile('./database/credentials.json');
    return JSON.parse(data);
};

(async () => {
    let credentials = await parseCredentials();

    const pool = mariadb.createPool({
        host: credentials['host'],
        user: credentials['user'],
        password: credentials['password'],
        connectionLimit: 5,
        trace: true // for debug purposes
    });

    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT NOW()');
        console.log(rows); //[ { 'NOW()': 2018-07-02T17:06:38.000Z }, meta: [ ... ] ]

    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    }

})();


