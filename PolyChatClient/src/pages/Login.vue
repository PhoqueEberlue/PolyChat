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
  username: 'AddInformation',
  data: () => ({
    username : '',
    password: '',
    res: null,
    notAuth: null
  }),
  methods: {
    async onSubmit(e) {
      e.preventDefault()

      const newInformation = {
        "username": this.username,
        "password": this.password
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

      this.res = await (await (await fetch("http://localhost:3000/login", requestOptions)).json())["authentified"] == true ? true : false;

      this.notAuth = !this.res;

      if (this.res) {
        $cookies.set("username", this.username);
        window.location.href = "/channel/";
      }
      console.log(this.res);
    }
  }
}
</script>

<template>
  <div class="wrapper">

    <form @submit="onSubmit">
      <HeaderMenu/>
      <h3> Username</h3>
      <input class="text" v-model="username"/>
      <h3> Password</h3>
      <input class="text" v-model="password"/>
      <div class="flex">
        <input type="submit" value="Log in" class="btn"/>
      </div>
    </form>

    <div class="flex" v-if="res">
      <h3 class="auth"> Loged In ! </h3>
      <router-link to="/channel"> click here to get redirected</router-link>
    </div>
    <div class="flex" v-else-if="notAuth">
      <h3 class="notAuth"> Unvalid credentials.</h3>
      <router-link to="/signup"> Please signup if necessaray.</router-link>
    </div>

  </div>
</template>

<style scoped>
input.text {
  display: flex;
  width: 20vw;
}

@media (min-width: 1024px) {
  input {
    display: flex;
  }
}

h3.auth {
  color: green;
}

h3.notAuth {
  color: red;
}

.flex {
  display: flex;
  justify-content: center;
}


</style>
