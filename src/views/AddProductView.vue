<template>
  <div class="admin-page">
    <div class="admin-panel">
      <h2 class="admin-panel__title">Dodaj nowy produkt</h2>
      <form @submit.prevent="handleSubmit" class="product-form">
        <input v-model="form.name" type="text" placeholder="Nazwa (wymagane)" class="product-form__input" required>
        <textarea v-model="form.description" placeholder="Opis" class="product-form__input"></textarea>
        <div class="product-form__row">
          <input v-model.number="form.price" type="number" step="0.01" placeholder="Cena" class="product-form__input">
          <input v-model.number="form.stock" type="number" placeholder="Stan magazynowy" class="product-form__input">
        </div>
        <input v-model="form.image_url" type="text" placeholder="URL zdjęcia" class="product-form__input">
        <button type="submit" :disabled="loading" class="product-form__button">
          {{ loading ? 'Wysyłanie...' : 'Wystaw produkt' }}
        </button>
      </form>
    </div>

    <hr class="admin-divider">

    <div class="admin-manage">
      <h3>Lista produktów w bazie (Zarządzaj)</h3>
      <div class="admin-list">
        <div v-for="prod in productStore.items" :key="prod.id" class="admin-item">
          <span class="admin-item__info">
            <strong>ID: {{ prod.id }}</strong> - {{ prod.name }} ({{ prod.price }} zł)
          </span>
          <button @click="confirmDelete(prod.id, prod.name)" class="admin-item__delete-btn">
            Usuń z bazy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'

const productStore = useProductStore()
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  price: null,
  image_url: '',
  stock: null
})

onMounted(() => {
  productStore.fetchProducts()
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await productStore.addProduct({ ...form.value })
    alert("Dodano pomyślnie!")
    form.value = { name: '', description: '', price: null, image_url: '', stock: null }
  } catch (e) {
    alert("Błąd: " + e.message)
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (id, name) => {
  if (confirm(`Usunąć trwale: ${name}?`)) {
    await productStore.deleteProduct(id)
  }
}
</script>

<style lang="scss">
.admin-panel {
  max-width: 600px;
  margin: 2rem auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  &__title { color: #333; margin-bottom: 1.5rem; }
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__input, &__textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  &__button {
    background: #10b981;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    &:disabled { background: #a7f3d0; }
  }

  &__status {
    padding: 10px;
    border-radius: 4px;
    &--success { background: #dcfce7; color: #15803d; }
    &--error { background: #fee2e2; color: #b91c1c; }
  }
}

.admin-divider { margin: 40px 0; border: 0; border-top: 1px solid #ccc; }

.admin-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border: 1px solid #eee;
  margin-bottom: 5px;
  border-radius: 4px;

  &__info { font-size: 0.9rem; }

  &__delete-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;

    &:hover { background: #dc2626; }
  }
}
</style>
