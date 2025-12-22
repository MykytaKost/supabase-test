<template>
  <div class="cart-page">
    <h2>Twój Koszyk</h2>

    <div v-if="cartStore.cartItems.length > 0" class="cart-container">
      <div class="cart-list">
        <div v-for="item in cartStore.cartItems" :key="item.id" class="cart-item">
          <img :src="item.image_url" class="cart-item__img" alt="">
          <div class="cart-item__info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price }} zł</p>
          </div>
          <div class="cart-item__qty">
            <button @click="cartStore.updateQuantity(item.id, item.qty - 1)">-</button>
            <span>{{ item.qty }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.qty + 1)">+</button>
          </div>
          <button @click="cartStore.removeFromCart(item.id)" class="cart-item__remove">Usuń</button>
        </div>
      </div>

      <div class="cart-summary">
        <h3>Razem: {{ cartStore.totalPrice }} zł</h3>
        <input v-model="address" type="text" placeholder="Adres dostawy" class="cart-summary__input">
        <button @click="handleOrder" :disabled="!address" class="cart-summary__btn">
          Kupuję i płacę
        </button>
      </div>
    </div>

    <div v-else class="cart-empty">
      <p>Twój koszyk jest pusty.</p>
      <router-link to="/">Wróć do zakupów</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const address = ref('')

const handleOrder = async () => {
  if (!authStore.user) {
    alert("Musisz być zalogowany, aby złożyć zamówienie!")
    return router.push('/login')
  }

  const result = await cartStore.placeOrder(address.value, authStore.user.id)
  
  if (result.success) {
    alert("Zamówienie złożone!")
    router.push('/')
  } else {
    alert("Błąd: " + result.error)
  }
}
</script>

<style lang="scss">
.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background: white;
  margin-bottom: 10px;

  &__img { width: 80px; height: 80px; object-fit: contain; }
  &__info { flex-grow: 1; }
  &__qty { display: flex; gap: 10px; align-items: center; }
  &__remove { color: red; border: none; background: none; cursor: pointer; }
}

.cart-summary {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  &__input { width: 100%; padding: 10px; margin-bottom: 10px; }
  &__btn { background: #ff5a00; color: white; width: 100%; padding: 15px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
}
</style>