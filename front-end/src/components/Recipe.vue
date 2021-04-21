<template>
<div>
    <div v-if="editing">
        <h1><input type="text" v-model="recipe.title" placeholder="Title"></h1>
        <p><textarea v-model="recipe.discription" placeholder="Discription"></textarea></p>
        <img :src="recipe.path">
        <ul>
            <li v-for="(ingredient, counter) in recipe.ingredients" :key="counter"><input type="text" v-model="ingredient.ingredient"><button @click="removeIngredient(counter)">X</button></li>
        </ul>
        <button @click="addIngredient">Add Ingredient</button>
        <p><textarea v-model="recipe.directions" placeholder="directions"></textarea></p>
        <p class="notes"><textarea v-model="recipe.notes" placeholder="notes"></textarea></p>
        <div>
            <button @click="submitChanges">Submit</button>
            <button @click="revert">Revert</button>
        </div>
    </div>
    <div v-else>
        <h1>{{recipe.title}}</h1>
        <button v-if="owner" @click="edit">Edit recipe</button>
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
        async submitChanges() {
            try {
                let titleChange = await axios.put('/api/recipe/' + this.recipeName, {
                    title: this.recipe.title,
                    discription: this.recipe.discription,
                    ingredients: JSON.stringify(this.recipe.ingredients),
                    directions: this.recipe.directions,
                    notes: this.recipe.notes
                });
                this.editing = false;
                if(titleChange.data) {
                    this.$emit('titleChange', this.recipe.title);
                }
            } catch (error) {
                console.log(error);
            }
        },
        edit() {
            this.editing = true;
        },
        revert() {
            this.editing = false;
            this.getRecipe();
        },
        addIngredient() {
            this.recipe.ingredients.push({
                ingredient: ""
            })
        },
        removeIngredient(counter) {
            this.recipe.ingredients.splice(counter,1);
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