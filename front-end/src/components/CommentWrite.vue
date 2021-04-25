<template>
<div>
    <textarea v-model="comment" placeholder="Write your comment here"></textarea>
    <p>Posting comment as {{user.firstName}} {{user.lastName}}</p>
    <div class= "row-spread">
        <button @click="toggleComment">Cancel</button>
        <button @click="uploadComment">Post</button>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: "CommentWrite",
    data() {
        return {
            comment: "",
        }
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    props: {
        sub: Boolean,
        parent: String,
    },
    methods: {
        async uploadComment() {
            let request = "/api/recipe/comments/"
            if(this.sub) {
                request += this.parent + "/sub";
            } else {
                request += this.parent + "/title";
            }
            try {
                await axios.post(request, {
                    comment: this.comment
                });
                this.$emit('upload');
            } catch(error) {
                console.log(error);
            }
        },
        toggleComment() {
            this.$emit('toggle');
        }
    }
}
</script>