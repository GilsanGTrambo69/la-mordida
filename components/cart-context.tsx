"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface CartItemIngredient {
  name: string
  removed: boolean
}

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  protein: string
  removedIngredients: string[]
  quantity: number
}

export interface ProductForModal {
  name: string
  description: string
  price: string
  image: string
  ingredients: string[]
  proteins: string[]
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  selectedProduct: ProductForModal | null
  setSelectedProduct: (product: ProductForModal | null) => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductForModal | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => [...prev, newItem])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        selectedProduct,
        setSelectedProduct,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export { parsePrice }
