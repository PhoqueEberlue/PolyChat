const mariadb = require("mariadb");
const {readFile} = require("fs/promises")
const sha256 = require("js-sha256").sha256;
const { exec } = require("child_process");



class DB_Controller {
    /*
    Controller of the database, must call initDBConnection before using other functions.
     */
    constructor() {
			this.path = "../../database/credentials";
    }

    async parseCredentials(path) {
        /*
        Parse credentials in PolyChat/database/credentials.json
        FIX: Might cause some problems if node is not run from the root of the project.
         */

        this.credentials = require(`${path}`);//surely nothing bad could happen Clueless
    }

    async initDBConnection() {
        /*
        Connects to the database
         */
        await this.parseCredentials(this.path);

        const pool = mariadb.createPool({
            host: this.credentials['host'],
            user: this.credentials['user'],
            password: this.credentials['password'],
            connectionLimit: 5,
            trace: true // for debug purposes
        });

        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query('use POLYCHAT');
        } catch (err) {
            throw err;
        } finally {
            if (conn) await conn.end();
        }

        this.conn = conn;
    };

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

    async checkCredentialsUser(nickname_user, password_user) {
        /*
        Checks if the credentials provided by a user are correct.
        Returns true if the credentials match a user in the database, false otherwise.
         */

        // Encrypt password
        let hash = sha256.create();
        hash.update(password_user);
        let encrypted_password = hash.hex();

        // Select user and check if password matches
        let res = await this.conn.query("SELECT * FROM USER WHERE nickname_user = ? and password_user = ?", [nickname_user, encrypted_password]);
        return typeof res != undefined;
    }

    async createChannel(channel_name, nickname_user) {
        /*
        Create a channel
        Takes the nickname of the creator of the channel.
         */
        const res = await this.conn.query('INSERT INTO CHANNEL(name_channel) VALUES(?)', [channel_name]);

        // Adds the creator of the channel in the channel and set his admin privileges.
        await this.addUserInChannel(parseInt(res['insertId']), nickname_user, true)

        return res != undefined;
    }

    async addUserInChannel(id_channel, nickname_user, is_admin) {
        /*
        Adds a user in a Channel
         */
        const res = await this.conn.query('INSERT IGNORE INTO IS_IN_CHANNEL(nickname_user, id_channel, is_admin) VALUES(?, ?, ?)',
            [nickname_user, id_channel, is_admin]);
        return res != undefined;

    }

    async removeUserFromChannel(id_channel, nickname_user_to_delete, nickname_user_admin) {
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

		async setUserAdmin(nickname, id){
				//set user as admin of this channel
				if(this.isUserAdminOfChannel(nickname, id)){
					return true;
				}
				else{
        const res = await this.conn.query("UPDATE IS_IN_CHANNEL SET is_admin = true WHERE nickname_user = ? and id_channel = ?",
            [nickname_user, id_channel])

        return res[0]['is_admin']
					
				}

		}

    async createMessage(id_channel, nickname_sender, content) {
        /*
        Stores a new message in the database
         */
        await this.conn.query("INSERT INTO MESSAGE(content_message, time_message, id_channel, nickname_user) VALUES(?, ?, ?, ?)",
            [content, new Date().toISOString().slice(0, 19).replace('T', ' '), id_channel, nickname_sender])
    }

    async getChannelsOfUser(nickname_user) {
        /*
        Returns every channel the user is in
         */
        return await this.conn.query("SELECT id_channel, name_channel FROM IS_IN_CHANNEL NATURAL JOIN CHANNEL WHERE nickname_user = ?", [nickname_user]);
    }

    async getUserOfChannel(channelId) {
        /*
        Returns every channel the user is in
         */
        return await this.conn.query("SELECT nickname_user FROM IS_IN_CHANNEL NATURAL JOIN CHANNEL WHERE id_channel = ?", [channelId]);
    }

    async getAllChannels() {
        /*
        Returns all channels of the app
         */
        return await this.conn.query("SELECT id_channel, name_channel FROM CHANNEL", []);
    }

		async getAllUsers(){
				//return all users of the app
        return await this.conn.query("SELECT nickname_user FROM USER", []);
		}

		async getLastNMessagesOfChannel(n, channel_id){
			let res = await this.conn.query("SELECT nickname_user, content_message, time_message \
				FROM MESSAGE WHERE id_channel = ? ORDER BY id_message DESC LIMIT ?", [channel_id, n]);
			return res;
		}

}

module.exports = {DB_Controller}
