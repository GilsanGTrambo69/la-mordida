"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface CartItemIngredient {
  name: string
  removed: boolean
}

export interface Addition {
  name: string
  price: number
}

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  protein: string
  proteins?: string[]  // Para productos que permiten múltiples proteínas
  removedIngredients: string[]
  additions: Addition[]
  selectedVegetable?: string
  selectedSauces?: string[]
  quantity: number
}

export interface ProductUnit {
  id: string
  protein: string
  proteins?: string[]  // Para productos que permiten múltiples proteínas
  removedIngredients: string[]
  additions: Addition[]
  selectedVegetable?: string
  selectedSauces?: string[]
}

export interface ProductForModal {
  name: string
  description: string
  price: string
  image: string
  ingredients: string[]
  proteins: string[]
  category?: string
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
  const sortedAdditions = [...unit.additions].map(a => a.name).sort().join(",")
  const sortedSauces = [...(unit.selectedSauces || [])].sort().join(",")
  const sortedProteins = [...(unit.proteins || [])].sort().join(",")
  return `${unit.protein}|${sortedProteins}|${sortedRemoved}|${sortedAdditions}|${unit.selectedVegetable || ""}|${sortedSauces}`
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
      const grouped = new Map<string, { protein: string; proteins?: string[]; removedIngredients: string[]; additions: Addition[]; selectedVegetable?: string; selectedSauces?: string[]; count: number }>()

      for (const unit of units) {
        const key = unitConfigKey(unit)
        const existing = grouped.get(key)
        if (existing) {
          existing.count += 1
        } else {
          grouped.set(key, {
            protein: unit.protein,
            proteins: unit.proteins ? [...unit.proteins] : undefined,
            removedIngredients: [...unit.removedIngredients],
            additions: [...unit.additions],
            selectedVegetable: unit.selectedVegetable,
            selectedSauces: unit.selectedSauces ? [...unit.selectedSauces] : undefined,
            count: 1,
          })
        }
      }

      const newItems: CartItem[] = []
      for (const [, group] of grouped) {
        const additionsTotal = group.additions.reduce((sum, a) => sum + a.price, 0)
        newItems.push({
          id: `${baseProduct.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          name: baseProduct.name,
          image: baseProduct.image,
          price: baseProduct.price + additionsTotal,
          protein: group.protein,
          proteins: group.proteins,
          removedIngredients: group.removedIngredients,
          additions: group.additions,
          selectedVegetable: group.selectedVegetable,
          selectedSauces: group.selectedSauces,
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
