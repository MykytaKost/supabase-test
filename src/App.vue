<template>
  <div id="app">
    <nav class="main-nav">
      <div class="main-nav__logo" @click="$router.push('/')">ALLEGRO CLONE</div>
      <div class="main-nav__links">
        <router-link to="/" class="main-nav__link">Produkty</router-link>
        <router-link to="/add-product" class="main-nav__link">Dodaj Produkt</router-link>
        
        <router-link to="/cart" class="main-nav__link main-nav__link--cart">
          Koszyk ({{ cartStore.itemsCount }})
        </router-link>

        <router-link to="/login" class="main-nav__link">Moje Konto</router-link>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from './stores/cartStore'
const cartStore = useCartStore() // Inicjalizacja, by licznik w template działał
</script>

<style lang="scss">
/* Możesz dodać wyróżnienie dla koszyka */
.main-nav__link--cart {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 4px;
}
</style>