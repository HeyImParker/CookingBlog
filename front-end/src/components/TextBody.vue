<template>
<div>
    <p v-for="(paragraph, counter) in body" :key="counter">{{paragraph}}</p>
</div>
</template>

<script>
export default {
    name: "TextBody",
    props: {
        text: String
    },
    computed: {
        body() {
            if(!this.text)
                return;
            let j = 0;
            let array = [];
            for(let i = 0; i < this.text.length; i++) {
                if(this.text[i] == "\n") {
                    array.push(this.text.substr(j, (i - j)));
                    j = i + 1;
                }
            }
            array.push(this.text.substr(j, (this.text.length - 1 - j)));
            return array;
        }
    }
}
</script>

<style scoped>
p {
    padding: .3em;
}
</style>