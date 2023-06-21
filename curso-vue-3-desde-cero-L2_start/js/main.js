const API = "https://api.github.com/users/";

const requestMaxTimeMs = 3000; //ms

const app = Vue.createApp({
    // model data
    data() {
        return {
          searchedUser: null,
          result: null, 
          error: null, 
          favorites: new Map()
        }
    }, 
    // created does not have access to the DOM
    created() {
        const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"))
        if (savedFavorites?.length){
            const favorites = new Map(savedFavorites.map(favorite => [favorite.login, favorite]))
            this.favorites = favorites;
        }
    },
    // computed properties -> to encapsulate the logic. whenever the condition changes, the property is reevaluated
    computed: {
        isFavorite() {
            return this.favorites.has(this.result.login)
        }, 
        allFavorites() {
            return Array.from(this.favorites.values())
        },         
    },

    methods: {
        async search() {
            // init values
            this.result = this.error = null;

            // cache
            const foundInFavorites = this.favorites.get(this.searchedUser)
            
            const shouldRequestAgain = (() => {
                if (!!foundInFavorites) {
                    // extract lastRequestTime property from foundInFavorites (object destructurization)
                    const { lastRequestTime } = foundInFavorites
                    const now = Date.now()
                    return (now - lastRequestTime) > requestMaxTimeMs
                }
                return false
            })()
              
            if (!!foundInFavorites && !shouldRequestAgain) {
            console.log("Found and used the cached version")
            return this.result = foundInFavorites
            }
              

            try {
                // search for the introduced user
                const user = await fetch(API + this.searchedUser)
                // if not found (404), throw an error
                if (!user.ok) throw new Error("User not found");
                // else retrieve data from the json
                const data = await user.json()
                // assign data to result
                this.result = data

            } catch (error) {
                this.error = error
            } finally {
                // reset searched value
                this.searchedUser = null 
            }
            
        },
        addFavorite() {
            // save the time when the favorite was added
            this.result.lastRequestTime = Date.now()
            this.favorites.set(this.result.login, this.result);
            this.updateStorage()
        }, 
        removeFavorite() {
            this.favorites.delete(this.result.login)
            this.updateStorage()
        }, 
        showFavorite(favorite) {
            this.result = favorite;
        },
        // method to implement the active 'transition'
        checkFavorite(id){
            return this.result?.login === id;
        },
        // update local storage to keep the favorites
        updateStorage() {
            // make a local storage for favorites
            window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
        }

    }
})