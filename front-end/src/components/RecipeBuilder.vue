<template>
<div>
    <input type="text" v-model="title" placeholder="title">
    <textarea v-model="discription" placeholder="discription"></textarea>
    <div v-for="(object, counter) in ingredients" :key="counter" >
        <input type="text" v-model="object.ingredient">
        <button @click="removeIngredient(counter)">X</button>
    </div>
    <button @click="addIngredient">Add Ingredient</button>
    <textarea v-model="directions" placeholder="directions"></textarea>
    <input type="file" name="filefield" @input="fileChanged">
    <textarea v-model="notes" placeholder="notes"></textarea>
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
textarea {
    display: block;
    margin: .5em auto;
}
</style>