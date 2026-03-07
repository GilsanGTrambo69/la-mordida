"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface CartItemIngredient {
  name: string
  removed: boolean
}

// Adiciones disponibles
export const ADICIONES = [
  "Carne desmechada",
  "Panceta al barril",
  "Pollo desmechado",
  "Cerdo desmechado",
  "Costilla ahumada",
] as const

export const ADICION_PRICE = 6000

// Opciones de seleccion para productos especificos
export const SELECCION_PROTEINAS = ["Carne", "Pollo", "Cerdo", "Chorizo"]
export const SELECCION_VEGETALES = ["Lechuga", "Tomate", "Cebolla", "Pico de gallo"]
export const SELECCION_SALSAS = ["Rosada", "BBQ", "De la casa", "Mayonesa", "Mostaza"]

export type Adicion = typeof ADICIONES[number]

export interface ProductSelections {
  proteina?: string
  vegetal?: string
  salsa?: string
}

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  protein: string
  removedIngredients: string[]
  adiciones: string[]
  selecciones?: ProductSelections
  quantity: number
}

export interface ProductUnit {
  id: string
  protein: string
  removedIngredients: string[]
  adiciones: string[]
  selecciones?: ProductSelections
}

export interface ProductForModal {
  name: string
  description: string
  price: string
  image: string
  ingredients: string[]
  proteins: string[]
  requiresSelections?: boolean
  selectionsType?: "salchipapa" | "perro"
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  addConfiguredUnits: (units: ProductUnit[], baseProduct: { name: string; image: string; price: number }) => void
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

function unitConfigKey(unit: ProductUnit): string {
  const sortedRemoved = [...unit.removedIngredients].sort().join(",")
  const sortedAdiciones = [...unit.adiciones].sort().join(",")
  const selectionsKey = unit.selecciones 
    ? `${unit.selecciones.proteina || ""}-${unit.selecciones.vegetal || ""}-${unit.selecciones.salsa || ""}`
    : ""
  return `${unit.protein}|${sortedRemoved}|${sortedAdiciones}|${selectionsKey}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductForModal | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => [...prev, newItem])
  }, [])

  const addConfiguredUnits = useCallback(
    (units: ProductUnit[], baseProduct: { name: string; image: string; price: number }) => {
      const grouped = new Map<string, { 
        protein: string
        removedIngredients: string[]
        adiciones: string[]
        selecciones?: ProductSelections
        count: number 
      }>()

      for (const unit of units) {
        const key = unitConfigKey(unit)
        const existing = grouped.get(key)
        if (existing) {
          existing.count += 1
        } else {
          grouped.set(key, {
            protein: unit.protein,
            removedIngredients: [...unit.removedIngredients],
            adiciones: [...unit.adiciones],
            selecciones: unit.selecciones,
            count: 1,
          })
        }
      }

      const newItems: CartItem[] = []
      for (const [, group] of grouped) {
        // Calcular precio con adiciones
        const adicionesTotal = group.adiciones.length * ADICION_PRICE
        const finalPrice = baseProduct.price + adicionesTotal

        newItems.push({
          id: `${baseProduct.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: baseProduct.name,
          image: baseProduct.image,
          price: finalPrice,
          protein: group.protein,
          removedIngredients: group.removedIngredients,
          adiciones: group.adiciones,
          selecciones: group.selecciones,
          quantity: group.count,
        })
      }

      setItems((prev) => [...prev, ...newItems])
    },
    []
  )

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
        addConfiguredUnits,
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
