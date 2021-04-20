<template>
<div>
    <div v-if="editing">
        <h1><input type="text" v-model="recipe.title" placeholder="Title"></h1>
        <p><textarea v-model="recipe.discription" placeholder="Discription"></textarea></p>
        <img :src="recipe.path">
        <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient._id"><input type="text" v-model="ingredient.ingredient"></li>
        </ul>
        <button @click="addIngredient">Add Ingredient</button>
        <p>{{recipe.directions}}</p>
        <p class="notes">{{recipe.notes}}</p>
    </div>
    <div v-else>
        <h1>{{recipe.title}}</h1>
        <p>{{recipe.discription}}</p>
        <img :src="recipe.path">
        <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient._id">{{ingredient.amount}} {{ingredient.ingredient}}</li>
        </ul>
        <p>{{recipe.directions}}</p>
        <p class="notes">{{recipe.notes}}</p>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: "Recipe",
    props: {
        recipeName: String
    },
    data() {
        return {
            recipe: {},
            editing: false,
        }
    },
    created() {
        this.getRecipe();
    },
    computed: {
        owner() {
            if(this.recipe.user._id === this.$root.$data.user._id) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        async getRecipe() {
            try {
                let itemResponse = await axios.get('/api/recipe/' + this.recipeName);
                this.recipe = itemResponse.data;
            } catch(error) {
                console.log(error);
            }
        },
        addIngredient() {
            this.recipe.ingredients.push({
                ingredient: ""
            })
        },
    }
}
</script>

<style scoped>
img {
    max-width: 50%;
    float: left;
    margin: 0 0 1em 1em;
}

h1 {
    padding: .5em;
}

li {
    text-align: left;
}

ul {
    margin: 1.5em;
    margin-left: 57%;
}
</style>