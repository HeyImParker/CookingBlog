<template>
<div>
    <input type="text" v-model="title" placeholder="title">
    <div v-for="(object, counter) in ingredients" :key="counter" >
        <input type="text" v-model="object.ingredient">
        <button @click="removeIngredient(counter)">X</button>
    </div>
    <button @click="addIngredient">Add Ingredient</button>
    <textarea v-model="directions" placeholder="directions"></textarea>
    <input type="file" name="filefield" @input="fileChanged" multiple="multiple">
    <textarea v-model="notes" placeholder="notes"></textarea>
    <button @click="upload">Upload</button>
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
            directions: "",
            notes: "",
            file: null,
            image: null
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
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name);
                formData.append('title', this.title);
                formData.append('directions', this.directions);
                formData.append('ingredients', JSON.stringify(this.ingredients));
                formData.append('notes', this.notes);
                await axios.post("/api/recipe", formData);
                // this.file = null;
                // this.title = "";
                // this.directions = "";
                // this.notes = "";
                this.image = axios.get('/api/recipe/image')
                this.$emit('uploadFinished');
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>