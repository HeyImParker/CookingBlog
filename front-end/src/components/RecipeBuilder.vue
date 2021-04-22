<template>
<div class="main">
    <input type="text" v-model="title" placeholder="Title">
    <textarea v-model="discription" placeholder="Discription"></textarea>
    <p>Picture: <input type="file" name="filefield" @input="fileChanged"></p>
    <p>Ingredients</p>
    <div v-for="(object, counter) in ingredients" :key="counter" >
        <input type="text" v-model="object.ingredient">
        <button class="x" @click="removeIngredient(counter)">X</button>
    </div>
    <button @click="addIngredient">Add Ingredient</button>
    <textarea class="big" v-model="directions" placeholder="Directions"></textarea>
    <textarea class="big" v-model="notes" placeholder="Notes"></textarea>
    <button @click="upload">Upload</button>
    <button @click="cancel">Cancel</button>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            title: "",
            ingredients: [
                {
                    ingredient: ""
                },{
                    ingredient: ""
                },{
                    ingredient: ""
                }
            ],
            discription: "",
            directions: "",
            notes: "",
            file: null,
        }
    },
    methods: {
        fileChanged(event) {
            this.file = event.target.files[0];
        },
        addIngredient() {
            this.ingredients.push({
                ingredient: ""
            })
        },
        removeIngredient(counter) {
            this.ingredients.splice(counter,1);
        },
        async upload() {
            try {
                for(let i = 0; i < this.ingredients.length; i++) {
                    if(this.ingredients[i].ingredient === "") {
                        this.ingredients.splice(i,1);
                        i--;
                    }
                }
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name);
                formData.append('title', this.title);
                formData.append('discription', this.discription);
                formData.append('directions', this.directions);
                formData.append('ingredients', JSON.stringify(this.ingredients));
                formData.append('notes', this.notes);
                await axios.post("/api/recipe", formData);
                this.file = null;
                this.title = "";
                this.discription = "";
                this.directions = "";
                this.ingredients= [
                    {
                        ingredient: ""
                    },{
                        ingredient: ""
                    },{
                        ingredient: ""
                    }
                ]
                this.notes = "";
                this.$emit('uploadFinished');
            } catch (error) {
                console.log(error);
            }
        },
        cancel() {
            this.file = null;
            this.title = "";
            this.discription = "";
            this.directions = "";
            this.ingredients= [
                {
                    ingredient: ""
                },{
                    ingredient: ""
                },{
                    ingredient: ""
                }
            ]
            this.notes = "";
            this.$emit('cancel');
        }
    }
}
</script>

<style scoped>
.main {
    border: var(--black) 1px solid;
    width: 90%;
    margin: 1em auto;
    padding: 1em;
}

textarea {
    width: 90%;
    display: block;
    margin: 1em auto;
    border-radius: 2px;
    padding: 2px;
}

.big {
    height: 8em;
}

p {
    margin: .5em;
}
</style>