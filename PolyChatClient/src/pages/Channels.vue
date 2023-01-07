<template>
  <div id="listChannel">

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
      user: "no"
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

      for (let channel in list_channel) {
        let channel_elem =  document.createElement("a");
        channel_elem.innerHTML = `[${list_channel[channel]["id_channel"]}] ${list_channel[channel]["name_channel"]}`
        channel_elem.href = `/channel/${list_channel[channel]["id_channel"]}`
        document.getElementById("listChannel").appendChild(channel_elem)
      }

      console.log(list_channel);
    })

    /* ------------- Executing on page load requests ------------- */

    // Request the channels the user is in
    this.socket.emit("get-channel", this.user);
  }
}
</script>

<style scoped>

</style>