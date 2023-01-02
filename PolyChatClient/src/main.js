import { createApp } from 'vue';
import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import Login from "@/pages/Login.vue";
import NotFound from "@/pages/NotFound.vue";
import Home from "@/pages/Home.vue";

import "./assets/main.css";

const routes = [
	{ name: "root", path: "/", component: Home },
	{ name: "login", path: "/login", component: Login },
	{ name: "NotFound", path: "/:pathMatch(.*)*", component: NotFound },
	//{ path: '/signup', component: Signup },
];

const router = createRouter({
	// 4. Provide the history implementation to use. We are using the hash history for simplicity here.
	history: createWebHistory(),
	routes: routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
