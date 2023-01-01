<script setup>
defineProps({
	name: {
		type: String,
		default: "FIXME",
	},
	url: {
		type: String,
		default: "FIXME",
	},
});
</script>

<template>
	<router-link :to="{ path: url }">
		{{ name }}
	</router-link>
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

@media (min-width: 1024px) {
	a {
		text-align: center;
	}
}
</style>
