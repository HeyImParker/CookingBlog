<template>
    <div v-if="user">
        <p>Logged in as {{user.username}}</p>
        <RecipeBuilder v-if="creating"/>
        <button v-else @click="toggleCreating">Add new recipe</button>
    </div>
    <Login v-else />
</template>

<script>
import Login from '@/components/Login.vue';
import RecipeBuilder from '@/components/RecipeBuilder.vue';
import axios from 'axios';
export default {
    name: 'account',
    data() {
        return {
            creating: false
        }
    },
    components: {
        Login,
        RecipeBuilder
    },
    async created() {
        try {
            let response = await axios.get('/api/users');
            this.$root.$data.user = response.data.user;
        } catch (error) {
            this.$root.$data.user = null;
        }
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        toggleCreating() {
            this.creating = !(this.creating);
        }
    }
}
</script>