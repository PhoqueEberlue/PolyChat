<script>
	export default {
		methods: {
			async signout(){
				await $cookies.remove("username");
        window.location.href = "/";
			}
		}
	}
</script>

<template>
	<a v-on:click="signout">
		Sign-out
	</a>
</template>

<style scoped>
a {
	font-size: 1.2rem;
	text-align: center;
	background-color: #1daae2;
	border-radius: 20px;
	color: black;
	padding: 5px;
	margin-left: 70px;
	margin-right: 70px;
}
a:hover{
	cursor:pointer;
}

@media (min-width: 1024px) {
	a {
		text-align: center;
	}
}
</style>
