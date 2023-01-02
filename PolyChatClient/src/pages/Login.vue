<script setup>
import HeaderMenu from "../components/HeaderMenu.vue";
defineProps({
	name: {
		type: String,
		default: "PolyChat",
	},
});
</script>

<script>
	export default {
		username : 'AddInformation',
		data (){
			return {
				username : '',
				password: '',
			}
		},
		methods : {
			onSubmit(e){
				e.preventDefault()
			//	if(!this.username || !this.password){
			//		console.log('Please Add a Name and password');
			//		return;
			//	}

				const newInformation = {
					"username" : "yes",
					"password" : "cum"
				}

				const requestOptions = {
					method: "POST",
			    headers: {
			        "Content-Type": "application/json"
			    },
					body: JSON.stringify(newInformation),
					mode:"no-cors"
				};

				fetch("http://localhost:3000/login", requestOptions);

				console.log(requestOptions);
				
				this.username = ' ';
				this.password = ' ';
			}
		}
	}
</script>

<template>
	<div class="wrapper">
		<form @submit="onSubmit">
			<HeaderMenu />
			<h3> Username</h3>
			<input class="" v-model="username" name="username" />
			<h3> Password</h3>
			<input class="" v-model="password" name="password" />
			<input type="submit" value="Log in" class="btn" />
		</form>
	</div>
</template>

<style scoped>
input {
	display: flex;
}

@media (min-width: 1024px) {
	input {
		display: flex;
	}
}



</style>
