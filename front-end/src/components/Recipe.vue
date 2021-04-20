<template>
    <div>
        <h1>{{recipe.title}}</h1>
        <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient._id">{{ingredient.amount}} {{ingredient.ingredient}}</li>
        </ul>
        <ol>
            <li v-for="step in recipe.directions" :key="step._id"></li>
        </ol>
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
            recipe: {}
        }
    },
    created() {
        this.recipe = this.getRecipe();
    },
    methods: {
        async getRecipe() {
            try {
                let itemResponse = await axios.get("'/api/recipe/' + recipeName");
                return itemResponse.data;
            } catch(error) {
                console.log(error);
            }
        },
    }
}
</script>

<style scoped>

</style>