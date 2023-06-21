app.component('app-profile', {
    // properties passed parent->child
    props: ['result', 'isFavorite'],
    // methods used in the template: define and emit event for the parent to listen (child->parent)
    methods: {
        addFavorite() {
            this.$emit('add-favorite')
        }, 
        removeFavorite() {
            this.$emit('remove-favorite')
        }
    },
    // component template
    template:
    `
    <div class="result" >
        <a v-if="isFavorite" href="#" class="result__toggle-favorite" @click="removeFavorite">Remove from favorites</a>
        <a v-else href="#" class="result__toggle-favorite" @click="addFavorite">Add to favorites</a>
        <h2 class="result__name">{{result.name}}</h2>
        <img class="result__avatar" v-bind:src="result.avatar_url">
        <p class="result__bio">{{result.bio}}</p>
    </div>
    `
})