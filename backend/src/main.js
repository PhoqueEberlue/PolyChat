let express = require('express');
let bodyParser = require('body-parser');

const db_controller = require('./database/DB_Controller');

let controller = new db_controller.DB_Controller();

let app = express();

app.use(bodyParser.json({type: ['application/json', 'text/plain']}));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/signup', (req, res) => { // Specifies which URL to listen for
  // req.body -- contains form data
	let username = req.body.username;
	let password = req.body.password;
	console.log(username + password);
});

app.post('/login', (req, res) => {
	//console.log(res);
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
})


	
app.get('/login', (req, res) => {
	console.log("something");

	console.log(req.headers);
  res.send('Hello World!')

})

app.listen(3000);


// SOCKETS
//import { Server } from "socket.io"; // Lmao' can't import outside modules?? wtf js
const socketio = require("socket.io"); // guess I'll just require xDDD

// Creating the socket server
const io = new socketio.Server(4500, {
	cors: {
		// Literally lying about the origin to avoid CORS errors lmao (change for the same port as the client)
		origin: "http://localhost:5173",

		credentials: true
	}});


// Declare our list of current channels
let list_channels;
(async () => {
	// loads existing channels from the database
	await controller.initDBConnection();
	list_channels = await controller.getAllChannels();

	// Adds a list to store connected users, this list won't be stored in the database
	for (let channel in list_channels) {
		list_channels[channel]["connected_users"] = []
	}
})();

function getChanel(id_channel) {
	for (let channel in list_channels) {
		if (list_channels[channel]["id_channel"] === parseInt(id_channel)) {
			return list_channels[channel];
		}
	}
}

// IO SOCKETS
io.on("connection", (socket) => {
	console.log("New user connected!" + socket.toString());

	// Greets our fabulous user
	socket.emit("greetings", "Hello from the server!");

	// Listen greetings back
	socket.on("greetings-back", (arg) => {
		console.log(arg);
	})

	// Listen channel requests
	socket.on("get-channel", async (nickname_user) => {
		const res = await controller.getChannelsOfUser(nickname_user)
		socket.emit("return-get-channel", res);
	});

	// Listen channel connections for user to connect to
	socket.on("connect-channel", (id_channel, nickname_user) => {
		console.log(`user ${nickname_user} connected to channel ${id_channel}`);

		let connected_users_nicknames = [];
		// Update the list of connected users
		let channel = getChanel(id_channel)

		// Adds the new user to the connected user list
		channel["connected_users"].push({"nickname_user": nickname_user, "socket_obj": socket});

		// Gets the name of all connected users
		for (let user in channel["connected_users"]) {
			connected_users_nicknames.push(channel["connected_users"][user]["nickname_user"]);
		}

		// Sends back the user the list of connected users
		socket.emit("return-connect-channel", connected_users_nicknames); // Sends the list of connected users
	});

	// Gets the message sent by a user in a channel
	socket.on("send-message-channel", async (nickname_user, id_channel, content) => {
		console.log(`[${id_channel}][${nickname_user}]: ${content}`);
		let channel = getChanel(id_channel);

		// Stores the message into the database
		await controller.createMessage(id_channel, nickname_user, content);

		// Loop through each connected users socket of the current channel
		for (let user in channel["connected_users"]) {
			// Send the message to the current user
			channel["connected_users"][user]["socket_obj"].emit("receive-message-channel", nickname_user, id_channel, content);
		}
	});
})