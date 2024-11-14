import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useCinemaStore } from './stores/cinemaStore'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const cinemaStore = useCinemaStore()
await cinemaStore.fecthVenues()

app.mount('#app')
