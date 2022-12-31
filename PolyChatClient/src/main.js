import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "@/pages/App.vue";
import Login from "@/pages/Login.vue";

import "./assets/main.css";

const routes = [
  { path: '/', component: App },
  { path: '/login', component: Login }
  //{ path: '/signup', component: Signup },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes:routes, 
});

const app = createApp();
app.use(router);
app.mount("#app");
