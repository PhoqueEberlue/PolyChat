<script setup>
import HeaderMenu from "../components/HeaderMenu.vue";
defineProps({
	name: {
		type: String,
		default: "PolyChat",
	},
});
</script>

<template>
	<div class="wrapper">
		<HeaderMenu />
		<input v-model="text" />
	</div>
</template>
