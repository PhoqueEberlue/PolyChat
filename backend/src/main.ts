let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

import mongoose from 'mongoose';
import {DB_Controller, Channels} from './database/DB_Controller';

let controller = new DB_Controller();

let app = express();

const corsOpt = {
	"origin": "*"
}

app.use(bodyParser.json({type: ['application/json', 'text/plain']}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOpt));


app.post('/signup', (req, res) => { // Specifies which URL to listen for
  // req.body -- contains form data
	let username = req.body.username;
	let password = req.body.password;

	controller.createUser(username, password).then((check) => {
		res.send(JSON.stringify({authentified: check}) + "\n");
	});
});

app.post('/login', (req, res) => {
	//console.log(res);
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;

	controller.checkCredentialsUser(username, password).then((check) => {
		res.send(JSON.stringify({authentified: check}) + "\n");
	});
});

app.post('/createChannel', (req, res) => {
	//console.log(res);
	let channelName = req.body.channel_name;
	let username = req.body.username;

	controller.createChannel(channelName, username).then((check) => {
		console.log(check);
		res.send(JSON.stringify({created: check}) + "\n");
	});
});

app.post('/addUser', (req, res) => {
	//console.log(res);
	let channelId = req.body.channel_id;
	let username = req.body.username;
	let toSend = {isAdmin: false, added: false, users:[]};

	if(controller.isUserAdminOfChannel(username, channelId)){
		toSend.isAdmin = true;
		controller.addUserInChannel(channelId, username, true).then((check) => {
			toSend.added = check;
			controller.getAllUsers().then((users) => {
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

	controller.addUserInChannel(channelId, username, false).then((check) => {
		res.send(JSON.stringify({success: check}) + "\n");
		console.log("added ", username, " to ", channelId)
		return;
	});
});



app.listen(80);
console.log("listening on 80");

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
	await controller.initDBConnection();
	list_channels = await controller.getAllChannels();

	// Adds a list to store connected users, this list won't be stored in the database
	for (let channel in list_channels) {
		list_channels[channel]["connected_users"] = []//this shouldnt be done here
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
	console.log("New user connected!");

	// Greets our fabulous user
	socket.emit("greetings", "Hello from the server!");

	// Listen greetings back
	socket.on("greetings-back", (arg) => {
		console.log(arg);
	})


	// Listen channel requests
	socket.on("get-channel", async (nickname_user) => {
		console.log("[GET CHANNEL] ", nickname_user);
		let res: Array<typeof Channels> = await controller.getChannelsOfUser(nickname_user);
		//let resString: Array<String> = await controller.getChannelByIds(res);
		socket.emit("return-get-channel", res);
	});


	// Listen channel connections for user to connect to
	socket.on("connect-channel", async (id_channel:string, nickname_user: string) => {
		console.log(`user ${nickname_user} connected to channel ${id_channel}`);

		let connected_users_nicknames = [];
		// Update the list of connected users
		let channel = getChanel(id_channel);
		//channel["connected_users"] = []
		if(channel == -1){
			console.log("ERROR no channel.");
		}

		// Adds the new user to the connected user list
		let obj = {"nickname_user": nickname_user, "socket_obj": socket};//TODO dictionnary
		//push only if not here
		if(!containsNickname(nickname_user, channel["connected_users"]))
			channel["connected_users"].push(obj);

		// Gets the name of all connected users
		for (let user of channel["connected_users"]) {
			connected_users_nicknames.push(user["nickname_user"]);
		}

		let last50messages = await controller.getLastNMessagesOfChannel(20, id_channel);
		console.log(last50messages);
		// Sends back the user the list of connected user
		socket.emit("return-connect-channel", connected_users_nicknames, last50messages); 
		// Sends the list of connected users and last 50 messages
	});


	// Gets the message sent by a user in a channel
	socket.on("send-message-channel", async (nickname_user, id_channel, content) => {
		console.log(`[${id_channel}][${nickname_user}]: ${content}`);
		let channel = getChanel(id_channel);

		// Stores the message into the database
		await controller.createMessage(id_channel, nickname_user, content);

		// Loop through each connected users socket of the current channel
		for (let user of channel["connected_users"]) {
			if (user["nickname_user"] !== nickname_user) {
				// Send the message to the current user
				user["socket_obj"].emit("receive-message-channel", nickname_user, id_channel, content);
			}
		}
	});
})
