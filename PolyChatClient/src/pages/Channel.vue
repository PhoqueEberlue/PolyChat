<script>
import io from 'socket.io-client';

export default {
  name: "channel",
  data() {
    return {
      // Defining our socket
      socket: io("http://localhost:4500"),
      users: [],
			user: "no"
    }
  },
	mounted(){
		console.log("user : ", this.user)
	},
  created() {
    // HARD CODED USER FOR TEST PURPOSES
    /* ------------- SETUP LISTENERS ------------- */


		this.user = $cookies.get("username");
    // Listen greetings of the ~ lovely ~ server UwU
    this.socket.on("greetings", (arg) => {
      console.log("Connected to the server");
      // Send greetings back
      this.socket.emit("greetings-back", `Wesh wesh cane a peche, c'est moi ${this.user}`);
    })

    // Listen the return of the get channel call
    this.socket.on("return-get-channel", (list_channel) => {
      // Gets the list of the channels
      console.log(list_channel);
    })

    // Listen the return of the connect channel call
    this.socket.on("return-connect-channel", (connected_users_nicknames) => {
      // Gets the list of the connected users
      console.log(connected_users_nicknames);
    })

    // Listen new messages sent by other users (including yourself, need to fix this later)
    this.socket.on("receive-message-channel", (nickname_user, id_channel, content) => {
      console.log(`[${id_channel}][${nickname_user}]: ${content}`);
    })

    /* ------------- Executing on page load requests ------------- */

    // Request the channels the user is in
    this.socket.emit("get-channel", this.user);


    // The following calls are for test purposes, they need to be summoned by user input
    this.socket.emit("connect-channel", "1", this.user); // When clicking on a channel for example (could redirect to a new page or change the current one)
    this.socket.emit("send-message-channel", this.user, "1", "Bonjour a tous mes petits gauchistes"); // When pressing enter / send message button
  }
}
</script>

<template>
	<div>
		<h3>yes {{ this.user }} </h3>
	</div>
</template>

<style scoped>

</style>
