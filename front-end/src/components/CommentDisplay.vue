<template>
<div>
    <hr>
    <div class="comment-box">
        <div class="left">
            <p>{{comment.comment}}</p>
            <h6>{{comment.user.firstName}} {{comment.user.lastName}} - {{formatDate(comment.created)}}</h6>
        </div>
        <div class="right">
            <div v-if="subComments.length > 0 && !viewing">
                <p class="circle">{{subComments.length}}</p>
                <button @click="toggleViewing">See comments</button>
            </div>
            <button v-if="viewing" @click="toggleViewing">Hide comments</button>
            <button v-if="!replying" @click="toggleReplying">Reply</button>
        </div>
    </div>
    <CommentWrite v-if="replying" :sub=true :parent=comment._id @upload="upload" @toggle="toggleReplying"></CommentWrite>
    <div class="sub-comments" v-if="viewing">
        <CommentDisplay v-for="comment in subComments" :key="comment._id" :comment=comment></CommentDisplay>
    </div>
</div>
</template>

<script>
import CommentWrite from '@/components/CommentWrite';
import moment from 'moment';
import axios from 'axios';
export default {
    name: "CommentDisplay",
    data() {
        return {
            replying: false,
            subComments: {},
            viewing: false,
        }
    },
    components: {
        CommentWrite,
    },
    props: {
        comment: {}
    },
    created() {
        this.getSubComments();
    },
    methods: {
        toggleReplying() {
            this.replying = !(this.replying);
        },
        formatDate(date) {
            if (moment(date).diff(Date.now(), 'days') < 15)
                return moment(date).fromNow();
            else
                return moment(date).format('d MMMM YYYY');
        },
        async getSubComments() {
            try {
                let response = await axios.get('/api/recipe/comments/' + this.comment._id + "/sub");
                this.subComments = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        toggleViewing() {
            this.viewing = !(this.viewing);
        },
        upload() {
            this.toggleReplying();
            this.getSubComments();
        }
    }
}
</script>

<style scoped>

.sub-comments {
    width: 99%;
    margin-left: auto;
    border-left: var(--light-grey) solid 2px;
}

hr {
    width: 80%;
    color: var(--black);
    margin: 1em auto;
}

.comment-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.left {
    text-align: left;
}

.right {
    text-align: right;
}

.right div {
    display: inline-block;
}

p {
    padding: .3em;
    padding-left: .5em;
}

h6 {
    color: rgb(146, 146, 146);
    padding-left: .5em;
}

.circle {
    display: inline-block;
    background: var(--light-grey);
    border-radius: 50%;
    width: 1.5em;
    font-size: .8em;
    height: 1.5em;
    margin: auto 0;
    text-align: center;
}
</style>