<script setup>

import HeaderMenu from "../components/HeaderMenu.vue";
</script>
<script>
import io from 'socket.io-client';

export default {
  name: "channel",
  data() {
    return {
      // Defining our socket
      socket: io("http://localhost:4500"),
      users: [],
			user: "no",
      channel_id: 'tmp',
    }
  },
	mounted(){
		console.log("user : ", this.user)
	},
  created() {
    this.channel_id = window.location.href.split("/").pop();

    // HARD CODED USER FOR TEST PURPOSES
    /* ------------- SETUP LISTENERS ------------- */


		this.user = $cookies.get("username");
    // Listen the return of the connect channel call
    this.socket.on("return-connect-channel", (connected_users_nicknames) => {
      // Gets the list of the connected users
      console.log(connected_users_nicknames);
    })

    // Listen new messages sent by other users (including yourself, need to fix this later)
    this.socket.on("receive-message-channel", (nickname_user, id_channel, content) => {
      let message_elem = document.createElement("div");
      message_elem.innerHTML = `[${nickname_user}]: ${content}`;
      document.getElementById("messages").appendChild(message_elem);
    })

    // Send a connect request
    this.socket.emit("connect-channel", this.channel_id, this.user);

  },
  methods: {
    sendMessage: function () {
      let message = document.getElementById("inputMessage").value;
      let message_elem = document.createElement("div");
      message_elem.innerHTML = `[You] ${message}`;
      document.getElementById("messages").appendChild(message_elem);

      this.socket.emit("send-message-channel", this.user, this.channel_id, message); // When pressing enter / send message button
      document.getElementById("inputMessage").value = "";
    }
  }
}
</script>

<template>
<div>
	<HeaderMenu />
  <div id="messages">
  </div>
	<div>
    <input id="inputMessage">
    <button id="sendMessage" v-on:click="sendMessage">Envoyer</button>
	</div>
</div>
</template>

<style scoped>

</style>
