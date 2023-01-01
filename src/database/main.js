const mariadb = require('mariadb');
const {readFile} = require("fs/promises")
const sha256 = require("js-sha256").sha256;

const parseCredentials = async () => {
    const data = await readFile('./database/credentials.json');
    return JSON.parse(data);
};

const initDBConnection = async () => {
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
        const rows = await conn.query('use POLYCHAT');
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
    }

    return conn;
};


class DB_Controller {
    constructor(conn) {
        this.conn = conn
    }

    async createUser(nickname_user, password_user) {
        /*
        Create a new user in the database.
        Returns false if the nickname is already taken or if an error occurred, True otherwise.
         */
        const res = await this.conn.query("select * from USER where nickname_user = ?", [nickname_user]);

        // Checks if the previous query returned anything
        if (res[0] === undefined) {
            // Encrypt password
            let hash = sha256.create();
            hash.update(password_user);
            let encrypted_password = hash.hex();

            await this.conn.query('INSERT INTO USER VALUES(?, ?)', [nickname_user, encrypted_password]);
            return true;
        } else {
            return false;
        }
    }

    async createChannel(channel_name, nickname_user) {
        /*
        Create a channel
        Takes the nickname of the creator of the channel.
         */
        const res = await this.conn.query('INSERT INTO CHANNEL(name_channel) VALUES(?)', [channel_name]);

        // Adds the creator of the channel in the channel and set his admin privileges.
        await this.addUserInChannel(parseInt(res['insertId']), nickname_user, true)
    }

    async addUserInChannel(id_channel, nickname_user, is_admin) {
        /*
        Adds a user in a Channel
         */
        await this.conn.query('INSERT INTO IS_IN_CHANNEL(nickname_user, id_channel, is_admin) VALUES(?, ?, ?)',
            [nickname_user, id_channel, is_admin])
    }

    async removeUserInChannel(id_channel, nickname_user_to_delete, nickname_user_admin) {
        /*
        Removes a user from a Channel.
        Returns false if the user that requested the deletion was not admin of the channel, true otherwise.
         */
        let is_admin = await this.isUserAdminOfChannel(nickname_user_admin, id_channel);

        // Check if the user is admin of the channel
        if (is_admin === 1) {
            await this.conn.query('DELETE FROM IS_IN_CHANNEL where nickname_user = ? and id_channel = ?',
                [nickname_user_to_delete, id_channel]);
            return true;
        } else {
            return false;
        }
    }

    async isUserAdminOfChannel(nickname_user, id_channel) {
        /*
        Return a boolean indicating if the user is admin of the given channel.
         */
        const res = await this.conn.query("SELECT is_admin FROM IS_IN_CHANNEL WHERE nickname_user = ? and id_channel = ?",
            [nickname_user, id_channel])

        return res[0]['is_admin']
    }
}


(async () => {
    const conn = await initDBConnection();

    const db_controller = new DB_Controller(conn);
    // await db_controller.createUser("test3", "aonstuh");

    //await db_controller.createChannel("AYAYA", "test3");
    //await db_controller.addUserInChannel(10, "test2", false);
    //await db_controller.removeUserInChannel(10, 'test2', "test3");
})();