<template>
<div>
  <div class="search">
    <input class="suggestions input" v-model="find" placeholder="Search">
  </div>
  <div class="grid">
    <router-link class="grid-item link" v-for="recipe in filteredRecipes" :key="recipe._id" :to="'/page/' + recipe.title">
      <h2>{{recipe.title}}</h2>
      <img :src="recipe.path">
    </router-link>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      recipes: [],
      find: "",
    }
  },
  created() {
    this.getRecipes();
  },
  computed: {
    filteredRecipes() {
      let recipes = this.recipes.filter(recipe => recipe.title.toLowerCase().startsWith(this.find.toLowerCase()));
      return recipes.sort((a, b) => a.name > b.name);
    },
    suggestionsLength() {
      if(this.suggestions.length > 0 && this.suggestions.length < 6) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    async getRecipes() {
      try {
        let response = await axios.get('/api/recipe');
        this.recipes = response.data;
      } catch(error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2em;
}

.grid-item {
  width: 14em;
  margin: 1em;
}

.grid-item img {
  max-width: 95%;
  max-height: 85%;
}

.search {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 5px 0;
}

.search input {
  display: block;
  margin: .2em 1.3em;
}

</style>