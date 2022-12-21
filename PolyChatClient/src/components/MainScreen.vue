<script setup>
defineProps({
	msg:{
	type:String,
	default:"PolyChat"
	}
});
</script>

<template>
	<div class="greetings">
		<h1 class="green">{{ msg }}</h1>
		<h3>
			This is a student project aimed at recreating a chat (discord / messenger like)
			written in javascript +
			<a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a> 
			for the front end.
			Backend is written in node.js
		</h3>
	</div>
</template>

<style scoped>
h1 {
	font-weight: 500;
	font-size: 2.6rem;
	top: -10px;
}

h3 {
	font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
	text-align: center;
}

@media (min-width: 1024px) {
	.greetings h1,
	.greetings h3 {
		text-align: left;
	}
}
</style>
