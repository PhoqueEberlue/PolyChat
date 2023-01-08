<script setup>
import Button from "../components/Button.vue"
</script>

<template>
  <div class="listChannel">
		<h2> List of channels :</h2>
		<div v-for="(channel, index) in list_channel" :key=index class="channel">
			<Button :url='"/channel/" + channel.id_channel'  :name="channel.name_channel " />
		</div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "Channels",
  data() {
    return {
      // Defining our socket
      socket: io("http://localhost:4500"),
      users: [],
      user: "no",
			list_channel: []
    }
  },
  created() {
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

			this.list_channel = list_channel;
      console.log(list_channel);
    })

    /* ------------- Executing on page load requests ------------- */

    // Request the channels the user is in
    this.socket.emit("get-channel", this.user);
  }
}
</script>

<style scoped>
h2 {
	display: flex;
	justify-content: center;
}
.listChannel {
	display: center;
	justify-content: center;

}

.channel {
	justify-content: center;
	margin: 10px;
}
</style>
