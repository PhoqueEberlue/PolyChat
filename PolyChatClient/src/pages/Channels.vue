<script setup>
import Button from "../components/Button.vue";
import socket from "../services/socketio";
</script>

<template>
	<div class="listChannel">
		<h2>List of channels :</h2>
		<div v-if="list_channel.length > 0">
			<div
				v-for="(channel, index) in list_channel"
				:key="index"
				class="channel"
			>
				<Button :url="'/channel/' + channel._id" :name="channel.name" />
				<Button :url="'/addUser/' + channel._id" name="add user" />
			</div>
		</div>
		<div v-else>its empty in here !</div>
		<Button url="/createChannel" name="Create a new channel" />
	</div>
</template>

<script>
import io from "socket.io-client";

export default {
	name: "Channels",
	data() {
		return {
			// Defining our socket
			socket: socket,
			users: [],
			user: "no",
			id: "no",
			list_channel: [],
		};
	},
	created() {
		this.socket.setup();
		this.user = $cookies.get("username");
		this.id = $cookies.get("id");

		// Listen greetings of the ~ lovely ~ server UwU
		this.socket.on("greetings", (arg) => {
			console.log("Connected to the server");
			// Send greetings back
			this.socket.emit(
				"greetings-back",
				`Wesh wesh cane a peche, c'est moi ${this.user}`
			);
		});

		// Listen the return of the get channel call
		this.socket.on("return-get-channel", (list_channel) => {
			// Gets the list of the channels

			this.list_channel = list_channel;

			//console.log(list_channel);
		});

		/* ------------- Executing on page load requests ------------- */

		// Request the channels the user is in
		this.socket.emit("get-channel", this.id);
	},
};
</script>

<style scoped>
h2 {
	display: flex;
	justify-content: center;
}
a {
	display: flex;
	justify-content: center;
}
.listChannel {
	display: center;
	justify-content: center;
	max-width: 50vw;
}

.channel {
	display: grid;
	grid-template-columns: 3fr 1fr;
	justify-content: center;
	margin-top: 10px;
}
</style>
