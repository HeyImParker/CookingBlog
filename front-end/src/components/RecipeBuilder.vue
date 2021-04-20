<template>
<div>
    <div v-for="(object, counter) in ingredients" :key="counter" >
        <input type="text" v-model="object.ingredient">
        <button @click="removeIngredient(counter)">X</button>
    </div>
    <button @click="addIngredient">Add Ingredient</button>
    <textarea v-model="directions" placeholder="directions"></textarea>
    <input type="file" name="filefield" multiple="multiple">
    <textarea v-model="notes" placeholder="notes"></textarea>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
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
            notes: ""
        }
    },
    methods: {
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
                formData.append('description', this.description);
                await axios.post("/api/photos", formData);
                this.file = null;
                this.url = "";
                this.title = "";
                this.description = "";
                this.$emit('uploadFinished');
            } catch (error) {
                console.log(error);
                this.error = "Error: " + error.response.data.message;
            }
        }
    }
}
</script>