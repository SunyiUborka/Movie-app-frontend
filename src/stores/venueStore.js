import axios from 'axios'
import { defineStore } from 'pinia'

export const useVenueStore = defineStore('venue',{
    state: () =>({
        venues: [],
        screenings: []
    }),
    actions: {
        async fecthVenues(){
            try{
                this.venues = (await axios("/api/v1/venues")).data
            }catch(err){
                console.log(err);
            }
        },
        async fetchScreenings(venueId){
            try{
                this.screenings = (await axios(`/api/v1/venue/${venueId}/screenings`)).data
            }catch(err){
                console.log(err);
            }
        }
    }, 
    getters:{
        getVenues: (state) => state.venues,
        getVenue: (state) => { 
            return (venueId) => state.venues.find((venue)=> venue.id == venueId
        )},
        getScreenings: (state) => state.screenings,
        getScreening: (state) => { 
            return (screeningId) => state.screenings.find((screening)=> screening.id == screeningId
        )}
    }
})
