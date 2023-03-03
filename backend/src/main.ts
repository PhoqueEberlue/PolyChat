let express = require('express');
import cors = require('cors');
let bodyParser = require('body-parser');

import mongoose from 'mongoose';
import {DB_Controller, Channels} from './database/DB_Controller';
import {Redis_Controller} from './database/redis_Controller';
import * as chalk from 'chalk';

let mongoController = new DB_Controller();
let redisController = new Redis_Controller();

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: ['application/json', 'text/plain']}));


app.post('/signup', (req, res) => { // Specifies which URL to listen for
  // req.body -- contains form data
	let username = req.body.username;
	let password = req.body.password;

	console.log(chalk.blue("[SIGNUP] "), req.body);
	mongoController.createUser(username, password).then((check) => {
		res.json({authentified: check});
	});
});

app.post('/login', (req, res) => {
	//console.log(res);
	console.log(chalk.blue("[LOGIN] "), req.body);
	let username = req.body.username;
	let password = req.body.password;

	mongoController.checkCredentialsUser(username, password).then((id) => {
		res.json({authentified: mongoose.isValidObjectId(id), id:id});
	});
});

app.post('/createChannel', (req, res) => {
	//console.log(res);
	let channelName = req.body.channel_name;
	let username = req.body.username;

	mongoController.createChannel(channelName, username).then((id) => {
		res.json({created: mongoose.isValidObjectId(id), id:id});
	});
});

app.post('/addUser', (req, res) => {
	//console.log(res);
	let channelId = req.body.channel_id;
	let username = req.body.username;
	let toSend = {isAdmin: false, added: false, users:[]};

	console.log(chalk.blue(`[CHANNEL ${channelId} ADD USER] `), req.body.username)

	if(mongoController.isUserAdminOfChannel(username, channelId)){
		toSend.isAdmin = true;
		mongoController.addUserInChannel(channelId, username, true).then((check) => {
			toSend.added = check;
			mongoController.getAllUsers().then((users) => {
				toSend.users = users;
				res.send(JSON.stringify(toSend) + "\n");
			});
		});

	}
	else 
		res.send(JSON.stringify({isAdmin: false}) + "\n");

});

app.post('/addUserToChannel', (req: any, res: any) => {
	//console.log(res);
	let channelId = req.body.channel_id;
	let username = req.body.username;

	mongoController.addUserInChannel(channelId, username, false).then((check) => {
		res.send(JSON.stringify({success: check}) + "\n");
		console.log("added ", username, " to ", channelId)
		return;
	});
});



app.listen(3000);
console.log(chalk.blue("[INIT]"), "listening on 3000");

// SOCKETS
//import { Server } from "socket.io"; // Lmao' can't import outside modules?? wtf js
import * as socketio from "socket.io";

// Creating the socket server
const io = new socketio.Server(4500, {
	cors: {
		// Literally lying about the origin to avoid CORS errors lmao (change for the same port as the client)
		credentials: true
	}});



// Declare our list of current channels
let list_channels = [];
let connectedUserList;
let socketList;

function containsNickname(nickname, list) {
	let x: Object;
	if(!(list != null && typeof list[Symbol.iterator] === 'function'))
		return false;//check if list is iterable
	for (x of list) {
		if (x["nickname_user"] === nickname) {
			return true;
		}
	}
	return false;
}

(async () => {
	// loads existing channels from the database
	await mongoController.initDBConnection();
	await redisController.init();

	list_channels = await mongoController.getAllChannels();
	connectedUserList = [];

	// Adds a list to store connected users, this list won't be stored in the database
	for (let channel in list_channels) {
		//TODO store it if at least one user on it
	}
})();

function getChanel(id_channel) {
	for (let channel of list_channels){
		if (channel["_id"].toString() == id_channel)
			return channel;
	}
	return -1;
}


// IO SOCKETS
io.on("connection", (socket) => {
	//console.log("New user connected!" + socket.toString());

	// Greets our fabulous user
	socket.emit("greetings", "Hello from the server!");

	// Listen greetings back
	socket.on("greetings-back", (arg) => {
		console.log(arg);
	})


	// Listen channel requests
	socket.on("get-channel", async (id) => {
		console.log(chalk.blue("[GET CHANNEL] "), id);
		let res: Array<typeof Channels> = await mongoController.getChannelsOfUserById(id);
		//let resString: Array<String> = await controller.getChannelByIds(res);
		socket.emit("return-get-channel", res);
	});


	// Listen channel connections for user to connect to
	socket.on("connect-channel", async (id_channel:string, id_user: string, username:string) => {
		console.log(chalk.blue("[CONNECT CHANNEL]"), `user ${id_user} connected to channel ${id_channel}`);

		//let connected_users_nicknames = [];
		// Update the list of connected users
		let channel = getChanel(id_channel);
		//channel["connected_users"] = []
		if(channel == -1){
			console.log(chalk.red("[CONNECT CHANNEL]"), "ERROR no channel.");
		}

		// Adds the new user to the connected user list
		//let obj = {"nickname_user": id_user, "socket_obj": socket};//TODO dictionnary
		//push only if not here
		redisController.insertUserIntoChannel(id_user, username, id_channel, socket);

		// Gets the name of all connected users
		let connectedUserList = await redisController.getUsersOfChannelById(id_channel);


		let last50messages = await mongoController.getLastNMessagesOfChannel(20, id_channel);
		// Sends back the user the list of connected user
		socket.emit("return-connect-channel", connectedUserList, last50messages);
		// Sends the list of connected users and last 50 messages
	});


	// Gets the message sent by a user in a channel
	socket.on("send-message-channel", async (user_id, nickname_user, id_channel, content) => {
		console.log(`[${id_channel}][${nickname_user}]: ${content}`);

		// Stores the message into the database
		await mongoController.createMessage(id_channel, nickname_user, content);

		// Loop through each connected users socket of the current channel
		for (let user in redisController.list_client[id_channel]) {
			if (user !== user_id) {
				// Send the message to all but the current user
				redisController.list_client[id_channel][user]["socket"].emit("receive-message-channel", nickname_user, id_channel, content);
			}
		}
	});
})
