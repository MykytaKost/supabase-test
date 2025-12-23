import { defineStore } from 'pinia'
import { supabase } from '../supabase/supabaseClient'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [], // Każdy element: { id, name, price, qty, image_url }
  }),
  
  getters: {
    // Oblicza sumę całego koszyka
    totalPrice: (state) => {
      return state.cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
    },
    // Zwraca liczbę przedmiotów (np. do ikonki w Navbarze)
    itemsCount: (state) => {
      return state.cartItems.reduce((sum, item) => sum + item.qty, 0)
    }
  },

  actions: {
    // 1. Dodawanie produktu (z logiką zwiększania ilości, jeśli już jest w koszyku)
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.qty++
      } else {
        this.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          qty: 1
        })
      }
    },

    // 2. Usuwanie konkretnej pozycji
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(item => item.id !== productId)
    },

    // 3. Zmiana ilości (np. przyciskami + / -)
    updateQuantity(productId, newQty) {
      const item = this.cartItems.find(item => item.id === productId)
      if (item && newQty > 0) {
        item.qty = newQty
      } else if (item && newQty === 0) {
        this.removeFromCart(productId)
      }
    },

    // 4. Składanie zamówienia (Twoja istniejąca logika + drobne poprawki)
    async placeOrder(address, userId) {
      try {
        if (this.cartItems.length === 0) throw new Error("Koszyk jest pusty")

        // 1. Wstaw do orders
        const { data: order, error: oErr } = await supabase
          .from('orders')
          .insert([{ 
            user_id: userId, 
            total_price: this.totalPrice, 
            address: address, 
            status: 'pending' 
          }])
          .select().single()

        if (oErr) throw oErr

        // 2. Przygotuj dane do order_items
        const itemsToInsert = this.cartItems.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.qty,
          price_at_purchase: item.price // Zawsze zapisuj cenę z momentu zakupu!
        }))

        // 3. Wstaw produkty zamówienia
        const { error: iErr } = await supabase.from('order_items').insert(itemsToInsert)
        if (iErr) throw iErr

        // 4. Sukces
        this.cartItems = []
        return { success: true, orderId: order.id }
      } catch (error) {
        console.error("Błąd zamówienia:", error.message)
        return { success: false, error: error.message }
      }
    }
  }
})