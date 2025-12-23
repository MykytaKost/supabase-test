<template>
  <div class="auth-view">
    <div class="auth-view__container">
      <h2 class="auth-view__title">{{ isLogin ? 'Logowanie' : 'Rejestracja' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="auth-form__group">
          <label class="auth-form__label">Email</label>
          <input v-model="email" type="email" class="auth-form__input" placeholder="twoj@email.pl" required>
        </div>

        <div class="auth-form__group">
          <label class="auth-form__label">Hasło</label>
          <input v-model="password" type="password" class="auth-form__input" placeholder="min. 6 znaków" required>
        </div>

        <div class="auth-form__actions">
          <button type="submit" class="auth-form__button auth-form__button--primary">
            {{ isLogin ? 'Zaloguj się' : 'Zarejestruj się' }}
          </button>
          
          <button type="button" @click="isLogin = !isLogin" class="auth-form__button auth-form__button--link">
            {{ isLogin ? 'Nie masz konta? Załóż je' : 'Masz już konto? Zaloguj się' }}
          </button>
        </div>
      </form>

      <div v-if="message" :class="['auth-view__message', `auth-view__message--${messageType}`]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const message = ref('')
const messageType = ref('') // 'error' lub 'success'

const handleSubmit = async () => {
  message.value = 'Przetwarzanie...'
  
  try {
    if (isLogin.value) {
      // Wykorzystujemy przetestowane wcześniej signInWithPassword
      await authStore.handleLogin(email.value, password.value)
      message.value = 'Zalogowano pomyślnie!'
      messageType.value = 'success'
      router.push('/') // Przekierowanie na stronę główną
    } else {
      // Wykorzystujemy przetestowane wcześniej signUp
      await authStore.handleRegister(email.value, password.value)
      message.value = 'Rejestracja pomyślna! Sprawdź email.'
      messageType.value = 'success'
    }
  } catch (error) {
    message.value = 'Błąd: ' + error.message
    messageType.value = 'error'
  }
}
</script>

<style lang="scss">
.auth-view {
  display: flex;
  justify-content: center;
  padding: 50px;

  &__container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  &__message {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    &--error { background: #fee2e2; color: #b91c1c; }
    &--success { background: #dcfce7; color: #15803d; }
  }
}

.auth-form {
  &__group { margin-bottom: 15px; }
  &__label { display: block; margin-bottom: 5px; }
  &__input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  &__button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
    &--primary { background: #ff5a00; color: white; border: none; border-radius: 4px; }
    &--link { background: none; border: none; color: #0066cc; text-decoration: underline; }
  }
}
</style>