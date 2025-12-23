<template>
  <div class="home">
    <h1 class="home__title">Nasze Produkty</h1>
    <p class="home__count" v-if="!loading">Dostępnych produktów: {{ productStore.items.length }}</p>

    <div v-if="loading" class="home__loader">Ładowanie produktów...</div>

    <div v-else class="product-grid">
      <div v-for="product in productStore.items" :key="product.id" class="product-card">
        <div class="product-card__image-container">
          <img 
            :src="product.image_url || 'https://via.placeholder.com/200'" 
            :alt="product.name" 
            class="product-card__image"
          >
        </div>
        
        <div class="product-card__content">
          <h3 class="product-card__name">{{ product.name }}</h3>
          <p class="product-card__description">{{ product.description }}</p>
          <p class="product-card__price">{{ product.price }} zł</p>
          
          <div class="product-card__actions">
            <button 
              @click="handleAddToCart(product)" 
              class="product-card__button product-card__button--add"
            >
              Do koszyka
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'

const productStore = useProductStore()
const cartStore = useCartStore()
const loading = ref(true)

onMounted(async () => {
  try {
    // Ważne: musimy poczekać na dane z Supabase
    await productStore.fetchProducts()
  } catch (error) {
    console.error("Błąd podczas pobierania produktów:", error)
  } finally {
    loading.value = false
  }
})

const handleAddToCart = (product) => {
  cartStore.addToCart(product)
  // Opcjonalnie: alert lub toast
  alert(`Dodano ${product.name} do koszyka!`)
}


</script>

<style lang="scss">
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;

  &__image-container {
    height: 200px;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  &__content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #ff5a00;
    margin: 10px 0;
  }

  &__button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background: #10b981;
    color: white;
    font-weight: bold;
    cursor: pointer;

    &:hover { background: #059669; }
  }
}
</style>