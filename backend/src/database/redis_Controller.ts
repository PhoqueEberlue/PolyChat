import { createClient, RedisClientType } from "redis";

import * as chalk from "chalk";


interface User {
	[key:string] : {username:string, socket:any}//key is userid
};

interface Channel {
	[key:string]: //key is channelid
		User;
}

class Redis_Controller {
	path:String;
	client:RedisClientType;
	list_client: Channel = {};


	/*
		Controller of the database, must call initDBConnection before using other functions.
		*/
	constructor() {
		//lmao
	}

	async init() {
		/*
				Connects to the database
				*/
		this.client = createClient();
		await this.client.connect();
		await this.client.configSet("notify-keyspace-events", "Ex");

		const sub = this.client.duplicate();
		sub.connect();
		sub.subscribe("__keyevent@0__:expired", (key) => {
			console.log(chalk.magenta("[KEY EXPIRE] "), key);
			delete this.list_client[key].socket;
			delete this.list_client[key];
		})
	}

	async getUsersOfChannelByIdComplete(id_channel:string):Promise<User> {
		let keys = await this.client.keys(`channelId:${id_channel}:*`);
		let res: User = {};

		return this.list_client[id_channel];
	}

	async getUsersOfChannelById(id_channel:string):Promise<string[]> {
		let keys = await this.client.keys(`channelId:${id_channel}:*`);

		for(let key of keys){
			key = key.replace(`channelId:${id_channel}:`, "");
		}

		return keys;
	}


	//async getAllChannelId() {//needed ?
	//	let res = await this.client.keys(`channelId:*`);
	//	for(let msg of res){
	//		msg = msg.replace(`channelId:`, "");
	//	}
	//	return res;
	//}

	async insertUserIntoChannel(id_user:string, username:string, id_channel:string, socket:any) {
		await this.client.set(`channelId:${id_channel}:${id_user}`, username, {EX: 60 * 10});
		let usr = {username:username, socket:socket};
		if (this.list_client[id_channel] === undefined)
			this.list_client[id_channel] = {};
		this.list_client[id_channel][id_user] = usr;
	}
	
	//setUserSocket(id_user:string, id_channel:string, socket:any){
	//	if(this.list_client[`channelId:${id_channel}:${id_user}`] != null)
	//		this.list_client[`channelId:${id_channel}:${id_user}`].socket = socket;
	//}
}

export {Redis_Controller};
