import axios from 'axios'
import { defineStore } from 'pinia'

export const useCinemaStore = defineStore('cinema',{
    state: () =>({
        venues: []
    }),
    actions: {
        async fecthVenues(){
            try{
                const r = await axios("/api/v1/venues")
                this.venues = r.data
            }catch(err){
                console.log(err);
            }
        }
    }, 
    getters:{
        getVenues: (state) => state.venues
    }
})
