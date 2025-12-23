import { defineStore } from 'pinia'
import { supabase } from '../supabase/supabaseClient'

export const useProductStore = defineStore('products', {
  state: () => ({
    items: [],
  }),
  actions: {
    // 1. Pobieranie produktów (GET)
    async fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }) // Najnowsze na górze

        if (error) throw error
        this.items = data
      } catch (error) {
        console.error("Błąd fetchProducts:", error.message)
      }
    },

    // 2. Dodawanie produktu (POST)
    async addProduct(productData) {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (error) throw error
      
      if (data) {
        this.items.unshift(data[0])
      }
      return data[0]
    },
    
    // 3. Usuwanie produktu (DELETE)
    async deleteProduct(id) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Aktualizacja stanu lokalnego
        this.items = this.items.filter(product => product.id !== id)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  } // Koniec actions
}) // Koniec defineStore