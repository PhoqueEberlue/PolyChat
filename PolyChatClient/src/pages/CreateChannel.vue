<script setup>
import Button from "../components/Button.vue"
</script>

<template>
  <div class="wrapper">
		<HeaderMenu/>
    <form @submit="onSubmit">
      <h2> Channel Name</h2>
      <input class="text" v-model="cName"/>
      <div class="flex">
        <input type="submit" value="Create" class="btn"/>
      </div>
    </form>

    <div class="flex" v-if="res">
      <h3 class="auth"> Channel created </h3>
      <router-link to="/channels"> click here to get redirected</router-link>
    </div>
    <div class="flex" v-else-if="notRes">
      <h3 class="notAuth"> Error while creating the channel.</h3>
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
			channel: "",
			res: null, //used to print errors
			notRes: null,//we also need its contrary (or if it has been init)
			user: ""
    }
  },
	async created(){
    this.user = $cookies.get("username");
	},
	methods: {
    async onSubmit(e) {
      e.preventDefault()

			//remove the next 2 lines please

      const newInformation = {
        "channel_name": this.cName,
				"username": this.user
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true"
        },
        body: JSON.stringify(newInformation)
      };

      this.res = await (await (await fetch("http://localhost:3000/createChannel", requestOptions)).json())["created"] ? true : false;

      if (this.res) {
        window.location.href = "/channels";
      }
    }
	}
}

</script>

<style scoped>
.flex{
	display:flex;
	justify-content: center;
}
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

}

.channel {
	justify-content: center;
	margin: 10px;
}
</style>
