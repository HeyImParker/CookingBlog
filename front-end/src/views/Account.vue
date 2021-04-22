<template>
    <div v-if="user" class="main">
        <p>Logged in as {{user.username}}</p>
        <RecipeBuilder v-if="creating" @uploadFinished="uploadFinished" @cancel="toggleCreating"/>
        <button v-else @click="toggleCreating">Add new recipe</button>
        <p v-if="recipes.length > 0">Select a recipe to view, edit, or delete</p>
        <p v-else>Once added, you can see your recipes here</p>
        <router-link class="links link" :to="'/page/' + recipe.title" v-for="recipe in recipes" :key="recipe._id">
            <div class="side-side">
                <h1>{{recipe.title}}</h1>
                <p>{{recipe.discription}}</p>
            </div>
            <div class="picture">
                <img :src="recipe.path">
            </div>
        </router-link>
        <button class="delete" @click="deleteAccount">Delete Account</button>
    </div>
    <Login v-else @logon="getRecipes"/>
</template>

<script>
import Login from '@/components/Login.vue';
import RecipeBuilder from '@/components/RecipeBuilder.vue';
import axios from 'axios';
export default {
    name: 'account',
    data() {
        return {
            creating: false,
            recipes: {},
        }
    },
    components: {
        Login,
        RecipeBuilder
    },
    async created() {
        this.getRecipes();
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        toggleCreating() {
            this.creating = !(this.creating);
        },
        async getRecipes() {
            try {
                let response = await axios.get('/api/recipe/users');
                this.recipes = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        uploadFinished() {
            this.creating = false;
            this.getRecipes();
        },
        async deleteAccount() {
            if(confirm("Deleting your account will cause you to lose all data associated to your account, including your recipes. Would you like to continue?")) {
                try {
                    for(let i = 0; i < this.recipes.length; i++) {
                        await axios.delete('/api/recipe/' + this.recipes[i].title);
                    }
                    await axios.delete('/api/users/user');
                    this.$root.$data.user = null;
                } catch(error) {
                    console.log(error);
                }
            }
        }
    }
}
</script>

<style scoped>
.main p,
.main button {
    margin: .5em 0;
}

.side-side {
    display: flex;
    justify-content: left;
}

.links {
    display: flex;
    justify-content: space-between;
    height: 10em;
    border: black 1px solid;
    align-items: center;
    margin: 1em;
    padding: .2em;
    text-decoration: none;
}

img {
    max-height: 100%;
    max-width: 100%;
}

.picture {
    height: 100%;
    max-width: 30em;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

h1 {
    margin: 0 2em;
}

@media only screen and (max-width: 400px) {
  h1 {
      margin: 0 .5em;
      font-size: 1em;
  }

  .links {
      height: 7em;
  }

  .links p {
      display: none;
  }
}

@media only screen and (min-width: 401px) and (max-width: 760px) {
  .links p {
      display: none;
  }

  h1 {
      margin: 0 1em;
      font-size: 1.5em;
  }
}

@media only screen and (min-width: 761px) {

}
</style>