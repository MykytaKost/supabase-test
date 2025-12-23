import { defineStore } from 'pinia'
import { supabase } from '../supabase/supabaseClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    // TESTOWANE: Rejestracja (POST)
    async handleRegister(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    // TESTOWANE: Logowanie (POST)
    async handleLogin(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      this.user = data.user
    }
  }
})