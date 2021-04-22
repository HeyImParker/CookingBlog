<template>
<div>
    <form>
      <div class="top">
        <p>Register for an account</p>
        <input placeholder="first name" v-model="firstName">
        <input placeholder="last name" v-model="lastName">
      </div>
      <div>
        <input placeholder="username" v-model="username">
        <input type="password" placeholder="password" v-model="password">
      </div>
      <div>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
      </div>
    </form>
    <p v-if="error" class="error">{{error}}</p>
    <form>
      <div class="top">
        <p>Login</p>
        <input placeholder="username" v-model="usernameLogin">
        <input type="password" placeholder="password" v-model="passwordLogin">
      </div>
      <div>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
      </div>
    </form>
    <p v-if="errorLogin" class="error">{{errorLogin}}</p>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'HomePage',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      error: '',
      errorLogin: '',
    }
  },
  methods: {
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        this.$emit('logon');
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
        this.$emit('logon');
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style scoped>
input {
  margin: .4em .2em;
}

p {
  padding: .4em;
}

.top {
  margin-top: 2em;
}

.error {
  margin-top: 10px;
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}

@media only screen and (max-width: 400px) {
  .top {
    margin-bottom: .7em;
  }
}
</style>