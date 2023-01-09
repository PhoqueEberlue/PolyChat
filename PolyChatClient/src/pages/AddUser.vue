<script setup>
import HeaderMenu from "../components/HeaderMenu.vue";
import Button from "../components/Button.vue";
</script>

<script>

export default {
  name: "AddUser",
  data: () => {
    return {
      users: [],
			user: "",
      channel_id: -1, 
			isAdmin: null,
			userToAdd: ""
    }
  },
	props: {
		id: String
	},
  async created() {
		if(isNaN(parseInt(this.id))){
			this.channel_id = 1;
			console.log(this.id);
		}
    else 
			this.channel_id = this.id;

		this.user = $cookies.get("username");//get cookies before app is mounted (cuz sockets)
		console.log("user : ", this.user);
		const newInformation = {
			channel_id: this.channel_id,
			username: this.user
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

		const res = await (await (await fetch("http://localhost:3000/addUser", requestOptions)).json());
		this.isAdmin = res["isAdmin"];
		for(let k of res["users"])
			this.users.push(k["nickname_user"]);

		console.log(res);

  },
  methods: {
    async submit(e) {
			e.preventDefault()
			const newInformation = {
						channel_id: this.channel_id,
						username: this.selected
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


			const success = await (await (await fetch("http://localhost:3000/addUserToChannel", requestOptions)).json())["success"];
			console.log(success)
			if(success)
        window.location.href = "/channel/" + this.id;
		},
  }
}
</script>

<template>
<div>
	<HeaderMenu />
	<div v-if="isAdmin">
		<h3> Choose a user to add to this channel </h3>
		<form @submit="submit">
			<select v-model="selected">
				<option disabled value="">Please select one</option>
				<option v-for="(user, index) in users" :key=index class="gens" id="messages">
					{{user}}
				</option>
			</select>
			<input type="submit" value="Add to channel" class="btn"/>
		</form>
	</div>
	<div v-else>
		<h3> You are not an admin of this channel. </h3>
	</div>
</div>
</template>

<style scoped>
h3{
	display: flex;
	justify-content: center;
	align-content: center;
}
.gens {
	display: flex;
	justify-content: center;
	align-content: center;
	margin: 20px;
}
</style>
