<template>
  <div class="page">
    <recipe recipe="recipe"/>
  </div>
</template>

<script>
import Recipe from '@/components/Recipe.vue'
export default {
  name: 'Page',
  components: {
    Recipe
  },
  data() {
    return {
      recipe: this.$route.params.recipeName
    }
  }
}
</script>