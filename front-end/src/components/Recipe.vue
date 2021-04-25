<template>
<div>
    <div v-if="editing">
        <h1><input type="text" v-model="recipe.title" placeholder="Title"></h1>
        <p><textarea v-model="recipe.discription" placeholder="Discription"></textarea></p>
        <div class="picture">
            <img :src="recipe.path">
        </div>
        <ul>
            <li v-for="(ingredient, counter) in recipe.ingredients" :key="counter"><input type="text" v-model="ingredient.ingredient"><button class="x" @click="removeIngredient(counter)">X</button></li>
            <li class="no-dot"><button @click="addIngredient">Add Ingredient</button></li>
        </ul>
        <p><textarea class="big" v-model="recipe.directions" placeholder="directions"></textarea></p>
        <p class="notes"><textarea class="big" v-model="recipe.notes" placeholder="notes"></textarea></p>
        <div>
            <button @click="submitChanges">Submit</button>
            <button @click="revert">Cancel</button>
            <button @click="deleteRecipe" class="delete">Delete recipe</button>
        </div>
        <p></p>
        <hr>
        <p></p>
    </div>
    <div v-else>
        <h1>{{recipe.title}}</h1>
        <button v-if="owner" @click="edit">Edit recipe</button>
        <p>{{recipe.discription}}</p>
        <p>First posted {{formatDate(recipe.created)}}</p>
        <div class="picture">
            <img :src="recipe.path">
        </div>
        <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient._id">{{ingredient.amount}} {{ingredient.ingredient}}</li>
        </ul>
        <TextBody :text="recipe.directions"></TextBody>
        <TextBody :text="recipe.notes"></TextBody>
    </div>
    <div class="comments">
      <div v-if="user">
        <CommentWrite v-if="commenting" sub="false" parent="recipeName" @upload="uploadComment" @toggle="toggleComment"></CommentWrite>
        <button v-else @click="toggleComment">Write a comment</button>
      </div>
      <div v-else>
          <p>Login to add comments</p>
      </div>
      <CommentDisplay class="comments" v-for="comment in comments" :key="comment._id" :comment="comment"></CommentDisplay>
      <p></p>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import TextBody from '@/components/TextBody.vue'
import CommentWrite from '@/components/CommentWrite.vue'
import CommentDisplay from '@/components/CommentDisplay.vue'
export default {
    name: "Recipe",
    props: {
        recipeName: String
    },
    components: {
        TextBody,
        CommentWrite,
        CommentDisplay,
    },
    data() {
        return {
            recipe: {
                user: {
                    _id: null
                }
            },
            editing: false,
            commenting: false,
            comments: {},
        }
    },
    created() {
        this.getRecipe();
        this.getComments();
    },
    computed: {
        owner() {
            if(this.$root.$data.user === null) {
                return false;
            } else if(this.recipe.user._id === this.$root.$data.user._id) {
                return true;
            } else {
                return false;
            }
        },
        user() {
            return this.$root.$data.user;
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
        async getComments() {
            try {
                let response = await axios.get('/api/recipe/comments/' + this.recipeName + '/title');
                this.comments = response.data;
            } catch (error) {
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
        toggleComment() {
            this.comment = "";
            this.commenting = !(this.commenting);
        },
        uploadComment() {
            this.toggleComment();
            this.getComments();
        },
        formatDate(date) {
            if (moment(date).diff(Date.now(), 'days') < 15)
                return moment(date).fromNow();
            else
                return moment(date).format('d MMMM YYYY');
        },
        async deleteRecipe() {
            if(confirm("Are sure you would like to delete your recipe?")) {
                try {
                    await axios.delete('/api/recipe/' + this.recipeName);
                    this.$emit('deleteRecipe');
                } catch(error) {
                    console.log(error);
                }
            }
        },
    }
}
</script>

<style scoped>
.picture {
    width: 50%;
    float: left;
    margin: .5em;
    margin-right: 1.5em;
}

img {
    max-width: 100%;
    margin: 0 auto;
}

textarea {
    width: 80%;
}

.big {
    height: 10em;
}

h1 {
    padding: .5em;
}

li {
    text-align: left;
}

.no-dot {
    list-style-type: none;
}

ul {
    margin: 1.5em;
    margin-left: 57%;
}

p {
    margin: .5em;
}

.comments {
    clear: both;
}

hr {
    width: 75%;
    color: var(--black);
    margin: 0 auto;
}

.comments {
    margin: 0 auto;
    width: 90%;
}

@media only screen and (max-width: 400px) {
    li input {
        width: 90%;
    }

    .x {
        margin: 0;
        padding: 2px;
    }
}

@media only screen and (min-width: 401px) and (max-width: 760px) {

}

@media only screen and (min-width: 761px) {

}
</style>