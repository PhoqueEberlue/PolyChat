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


const routes = [
	{ name: "root", path: "/", component: Home },
	{ name: "login", path: "/login", component: Login },
	{ name: "signup", path: "/signup", component: Signup },
	{ name: "channel", path: "/channel", component: Channel,
		children:[{
			path: "/channel/:id", component: Channel,
		}]
	},
	{ name: "NotFound", path: "/:pathMatch(.*)*", component: NotFound },
	//{ path: '/signup', component: Signup },
];

const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes: routes,
});

const app = createApp(App);
app.use(router).use(VueCookies, {expire: '1d'});
app.mount("#app");

// TODO: Implement a kind of 'connection' and pass the user's nickname to our components
// At the moment the user is hard coded in Channel.vue for test purposes of the socket
