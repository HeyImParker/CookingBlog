<template>
  <div class="page">
    <recipe :recipeName="recipe" @titleChange="titleChange"/>
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
  },
  methods: {
    titleChange(title) {
      this.$router.push({ path: `/page/${title}` })
    }
  }
}
</script>