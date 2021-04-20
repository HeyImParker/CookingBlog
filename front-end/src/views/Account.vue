<template>
    <div v-if="user">
        <p>Logged in as {{user.username}}</p>
        <RecipeBuilder v-if="creating" @uploadFinished="uploadFinished" @cancel="toggleCreating"/>
        <button v-else @click="toggleCreating">Add new recipe</button>
        <router-link class="links" :to="'/page/' + recipe.title" v-for="recipe in recipes" :key="recipe._id">
            <h1>{{recipe.title}}</h1>
            <p>{{recipe.discription}}</p>
            <img :src="recipe.path">
        </router-link>
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
        }
    }
}
</script>

<style scoped>
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

.links * {
    padding: 0 1em;
}

.links img {
    max-height: 10em;
    max-width: 30em;
    height: auto;
    width: auto;
}
</style>