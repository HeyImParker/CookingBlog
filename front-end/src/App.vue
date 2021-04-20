<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <div v-if="user">
      <router-link to="/account">My Account</router-link>
      <button @click="logOut">Log Out</button>
      </div>
      <div v-else>
        <router-link to="/account">Log In</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  async created() {
        try {
            let response = await axios.get('/api/users');
            this.$root.$data.user = response.data.user;
        } catch (error) {
            this.$root.$data.user = null;
        }
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
  methods: {
    async logOut() {
      if(this.user) {
        try {
          await axios.delete('api/users');
          this.$root.$data.user = null;
        } catch(error) {
          console.log(error);
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
