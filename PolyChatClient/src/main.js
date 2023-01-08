import { createApp } from 'vue';
import { createRouter, createWebHistory } from "vue-router";
import { VueCookies } from 'vue-cookies'
import App from "@/App.vue";
import Login from "@/pages/Login.vue";
import Signup from "@/pages/Signup.vue";
import NotFound from "@/pages/NotFound.vue";
import Home from "@/pages/Home.vue";
import Channel from "@/pages/Channel.vue";

import "./assets/main.css";
import Channels from "@/pages/Channels.vue";


const routes = [
	{ name: "root", path: "/", component: Home },
	{ name: "login", path: "/login", component: Login },
	{ name: "signup", path: "/signup", component: Signup },
	{ name: "channels", path: "/channels", component: Channels},
	{ name: "channel", path: "/channel/:id", component: Channel, props: true},
	{ name: "NotFound", path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes: routes,
});

const app = createApp(App);
app.use(router).use(VueCookies, {expire: '1d'});
app.mount("#app");
