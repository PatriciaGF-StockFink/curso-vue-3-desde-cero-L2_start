const API = "https://api.github.com/users/";

const app = Vue.createApp({
    data() {
        return {
          searchedUser: null,
          result: null, 
          error: null
        }
    }, 
    methods: {
        async search() {
            this.result = this.error = null;
            try {
                const user = await fetch(API + this.searchedUser)
                if (!user.ok) throw new Error("User not found");
                
                const data = await user.json()
                this.result = data

            } catch (error) {
                this.error = error
            } finally {
                this.searchedUser = null 
            }
            
        }
    }
})