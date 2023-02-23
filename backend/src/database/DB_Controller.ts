import mongoose from "mongoose";

import Channels from "./models/channels";
import { Users, UsersSchema } from "./models/users";
import { Messages } from "./models/messages";
import {readFile} from "fs/promises";
import { sha256 } from "js-sha256";
import { exec } from "child_process";


class DB_Controller {
	path:String;
	credentials:JSON;

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

		console.log("connecting to: ", this.credentials["con_string"])
		mongoose.connect(this.credentials["con_string"] + "/" + this.credentials["database"]);

		mongoose.connection.on('connected', async (ref) => {
			console.log('Connected to mongo server.');
		});

		mongoose.connection.on("error", (err) => {
			console.log(err);
		});

	};

	async createUser(nickname_user: String, password_user: String):Promise<Boolean> {
		/*
				Create a new user in the database.
				Returns false if the nickname is already taken or if an error occurred, True otherwise.
				*/
		const res = await Users.findOne({username: nickname_user});// Checks if the previous query returned anything
		if (res === undefined || res === null) {
			// Encrypt password
			//let hash = sha256.create();
			//hash.update(password_user);
			//let encrypted_password = hash.hex();

			let ret = await Users.create({username: nickname_user, password: password_user, channels: []});
			console.log("[CREATE USER] User ", nickname_user, " created with id ", ret.id)
			return true;
		} 
		else {
			console.log("User ", nickname_user, " already exists");
			return false;
		}
	}

	async checkCredentialsUser(nickname_user: String, password_user: String) {
		/*
				Checks if the credentials provided by a user are correct.
				Returns true if the credentials match a user in the database, false otherwise.
				*/

		// Encrypt password
		//let hash = sha256.create();
		//hash.update(password_user);
		//let encrypted_password = hash.hex();

		// Select user and check if password matches
		let res = await Users.findOne({username: nickname_user, password: password_user});
		return res !== null;
	}

	async createChannel(channel_name:String, nickname_user: String) {
		/*
				Create a channel
				Takes the nickname of the creator of the channel.
				if channel exists, returns false
				*/
		const user = await Users.findOne({username: nickname_user});
		let channels = user.channels;
		const res = await Channels.create({name: channel_name, admins: [user], members: [user]});
		user.channels.push(res._id);
		await user.save();
		;

		// Adds the creator of the channel in the channel and set his admin privileges.

		return res !== undefined;
	}

	async addUserInChannel(id_channel: any, nickname_user:String, is_admin:Boolean) {
		/*
				Adds a user in a Channel
				*/
		const user = await Users.findOne({username: nickname_user});

		user.channels.push(id_channel);
		const channel = await Channels.findById(id_channel);

		if(channel === undefined) 
			return false;

		channel.members.push(user._id);
		if(is_admin){
			channel.admins.push(user._id);
		}
		await channel.save();
		await user.save()

		return true;
	}

	async removeUserFromChannel(id_channel: String, nickname_user_to_delete: String, nickname_user_admin:String) {
		/*
				Removes a user from a Channel.
				Returns false if the user that requested the deletion was not admin of the channel, true otherwise.
				*/
		let is_admin = await this.isUserAdminOfChannel(nickname_user_admin, id_channel);

		// Check if the user is admin of the channel
		let res = false;
		if (is_admin == true) {
			res = await Channels.deleteOne({username: nickname_user_to_delete}) !== undefined;
		}
		return res;
	}

	async isUserAdminOfChannel(nickname_user: String, channel_id: String) {
		/*
				Return a boolean indicating if the user is admin of the given channel.
				*/
		let admins = (await Channels.findById(channel_id))["admins"];
		let user = await Users.findOne({username: nickname_user});
		return admins.includes(user._id);
	}

	async setUserAdminOfChannel(nickname: String, channel_name: String){
		//set user as admin of this channel
		if(this.isUserAdminOfChannel(nickname, channel_name)){
			return true;
		}
		else{
			let user = await Users.findOne({username: nickname});
			let channel = await Channels.findOne({name: channel_name});
			channel.admins.push(user._id);
			await channel.save();
		}
	}

	async createMessage(id_channel: String, nickname_sender: String, content: String) {
		/*
				Stores a new message in the database
				*/
		const user = await Users.findOne({name: nickname_sender});
		const channel = await Channels.findById(id_channel);

		console.log("[CHANNEL]", channel, " id ", id_channel);

		let message = new Messages({author: user._id, content: content, date: Date.now(), channel: channel });
		channel.messages.push(message._id);
		await (message.save(), channel.save());
	}
	
	async getChannelByIds(ids: mongoose.Types.ObjectId[]) {
		// return name of channel by ids
		// takes an array of mongoose ID and return an array of names
		let res: String[] = [];
		for(let id of ids){
			let tmp = (await Channels.findById(id)).name;
			res.push(tmp);
		}
		return res;
	}

	async getChannelsIdsOfUser(nickname_user: String) {
		/*
				Returns every channel the user is in
				*/
		return (await Users.findOne({username: nickname_user})).channels;
	}

	async getChannelsOfUser(nickname_user: String) {
		/*
				Returns every channel the user is in
				*/
		let channels: Array<typeof Channels> = [];
		for(let id of await this.getChannelsIdsOfUser(nickname_user)){
			channels.push(await Channels.findById(id));
		}
		return channels;

	}

	async getUserOfChannel(id_channel: String) {
		/*
				Returns every channel the user is in
				*/
		return (await Channels.findById(id_channel)).members;
	}

	async getAllChannels() {
		/*
				Returns all channels of the app
				*/
		let res = await Channels.find();
		return res;
	}

	async getAllUsers(){
		//return all users of the app

		return Users.find();
	}

	async getLastNMessagesOfChannel(n: number, channel_id: String){
		let messages = await (await Channels.findById(channel_id)).populate({path: "messages", 
				select:["author", "content", "date"],
				options: {limit: n}, 
				populate: {path: "author", select: "username", model:"User"}});
		
		let res = []	
		for(let m of messages["messages"]){
			res.push({author: m["author"].username, content: m["content"], date: m["date"]});
		}
		return res.reverse();
	}

}

export {DB_Controller, Channels, Users};
