import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'

export interface CartItem {
  sku: string
  quantity: number
  price: number
  name: string
  image?: string
}

interface CartState {
  items: CartItem[]
  reservationId: string | null
  expiresAt: string | null
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  setReservation: (id: string, expiresAt: string) => void
  clearReservation: () => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      reservationId: null,
      expiresAt: null,
      addItem: (item) =>
        set(
          produce((state) => {
            const existing = state.items.find((i: CartItem) => i.sku === item.sku)
            if (existing) {
              existing.quantity += item.quantity
            } else {
              state.items.push(item)
            }
          })
        ),
      removeItem: (sku) =>
        set(
          produce((state) => {
            const index = state.items.findIndex((i: CartItem) => i.sku === sku)
            if (index !== -1) {
              state.items.splice(index, 1)
            }
          })
        ),
      updateQuantity: (sku, quantity) =>
        set(
          produce((state) => {
            const item = state.items.find((i: CartItem) => i.sku === sku)
            if (item) {
              item.quantity = quantity
            }
          })
        ),
      setReservation: (id, expiresAt) => set({ reservationId: id, expiresAt }),
      clearReservation: () => set({ reservationId: null, expiresAt: null }),
      clearCart: () => set({ items: [], reservationId: null, expiresAt: null }),
    }),
    {
      name: 'merlion-cart',
    }
  )
)
