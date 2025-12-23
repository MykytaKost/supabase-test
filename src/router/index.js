import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AddProductView from '../views/AddProductView.vue'
import CartView from '../views/CartView.vue' // 1. Importujemy widok koszyka

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/add-product', name: 'add-product', component: AddProductView },
    { path: '/cart', name: 'cart', component: CartView } // 2. Dodajemy ścieżkę
  ]
})

export default router