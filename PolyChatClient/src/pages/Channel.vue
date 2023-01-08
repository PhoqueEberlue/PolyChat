<script setup>
import HeaderMenu from "../components/HeaderMenu.vue";
</script>
<script>
import io from 'socket.io-client';


export default {
  name: "channel",
  data: () => {
    return {
      // Defining our socket
      socket: io("http://localhost:4500"),
      users: [],
			user: "no",
      channel_id: 'tmp',
			messages: [],
			inputMessage: ""
    }
  },
	props: {
		id: Number
	},
	mounted(){
	 //has to be after socket has been created, after we got username and chan id 
	 //and mounted is after created in lifecycle hooks
	 console.log("username: ", this.user, "| id: ", this.channel_id)
   this.socket.on("return-connect-channel", (connected_users_nicknames) => {
      // Gets the list of the connected users
      console.log(connected_users_nicknames);
    });


    this.socket.on("greetings", (msg) => {
      // Gets the list of the connected users
      console.log(msg);
			this.socket.emit("greetings-back", "hello from client!");
    });

    // Listen new messages sent by other users (including yourself, need to fix this later)
    this.socket.on("receive-message-channel", (nickname_user, id_channel, content) => {
      console.log("message from :", nickname_user);
			this.messages.push({author: nickname_user, content: content});
    });

    // Send a connect request
    this.socket.emit("connect-channel", this.channel_id, this.user);

	},
  created() {
		if(isNaN(parseInt(this.id))){
			this.channel_id = 1;
			console.log(this.id);
		}
    else 
			this.channel_id = this.id;

    // HARD CODED USER FOR TEST PURPOSES
    /* ------------- SETUP LISTENERS ------------- */


		this.user = $cookies.get("username");
    // Listen the return of the connect channel call
 
  },
  methods: {
    sendMessage(e) {
			//this.messages.push(this.inputMessage);
			e.preventDefault();
			if(this.inputMessage === "") return;
			this.messages.push({author: "You", content: this.inputMessage});
      this.socket.emit("send-message-channel", this.user, this.channel_id, this.inputMessage); // When pressing enter / send message button
			this.inputMessage = "";
    },
  }
}
</script>

<template>
<div>
	<HeaderMenu />
  <div v-for="(msg, index) in messages" :key=index class="messages" id="messages">
		<div> [{{ msg.author }}]: {{ msg.content }} </div>
  </div>
	<form @submit="sendMessage">
    <input class="text" v-model="inputMessage">
		<input type="submit" value="Send message" class="btn"/>
	</form>
</div>
</template>

<style scoped>

</style>
