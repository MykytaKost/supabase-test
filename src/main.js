import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importujemy style (możesz użyć swojego style.css lub głównego pliku SCSS)
import './style.css'

// 1. Tworzymy instancję aplikacji Vue
const app = createApp(App)

// 2. Tworzymy instancję Pinii (nasz "mózg" aplikacji)
const pinia = createPinia()

// 3. Rejestrujemy wtyczki w aplikacji
app.use(pinia)   // Teraz Store'y (authStore, productStore) będą działać
app.use(router)  // Teraz nawigacja i <router-view /> będą działać

// 4. Montujemy aplikację w elemencie #app w pliku index.html
app.mount('#app')