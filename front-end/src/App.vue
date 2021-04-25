<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" class="title-home">
        <img src="@/assets/favicon.png">
        <p class="title">The Mixing Bowl</p>
      </router-link>
      <div v-if="user">
      <router-link to="/account">My Account</router-link>
      <button @click="logOut">Log Out</button>
      </div>
      <div v-else>
        <router-link to="/account">Sign In</router-link>
      </div>
    </div>
    <router-view/>
    <div class="footer">
      <p>I spent about 18 hours on this project</p>
      <a href="https://github.com/HeyImParker/CookingBlog">Github Repository</a>
    </div>
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
    },
  },
  methods: {
    async logOut() {
      if(this.user) {
        try {
          await axios.delete('/api/users');
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
/* color scheme */
:root {
  --black: #1d191b;
  --dark: #267394;
  --light: #d4f5e9;
  --light-grey: rgb(226, 226, 226);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

p,
h1,
h2,
a {
  color: var(--black);
}

button {
  color: white;
  background: var(--dark);
  border: none;
  border-radius: 2px;
  padding: 4px;
  margin: 3px;
  cursor: pointer;
}

.title-home {
  display: flex;
  align-items: center;
}

.title {
  font-family: 'Sacramento', cursive;
  font-size: 2em;
  margin: auto .5em;
}

a {
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 20px 30px 5px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--light);
}

#nav a {
  font-weight: bold;
  color: var(--black);
  margin: .5em;
}

#nav img {
  height: 3em;
  width: auto;
}

.link {
  border: var(--black) 1px solid;
}

.link:hover {
  box-shadow: 0 0 2px var(--black);
}

.delete {
    background: rgb(194, 35, 35);
}

.x {
  color: var(--black);
  background: none;
}

.footer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 1em;
}

.footer a {
  text-decoration: underline;
  display: block;
  color: var(--dark);
}

@media only screen and (max-width: 400px) {
  .title {
    display: none;
  }
}

@media only screen and (min-width: 401px) and (max-width: 760px) {
  .title-home img{
    display: none;
  }
}

@media only screen and (min-width: 761px) {

}
</style>
