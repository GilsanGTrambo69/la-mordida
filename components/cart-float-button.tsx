"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-context"

export function CartFloatButton() {
  const { totalItems, setCartOpen } = useCart()

  if (totalItems === 0) return null

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="fixed bottom-6 left-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      aria-label={`Abrir carrito con ${totalItems} productos`}
      style={{
        boxShadow: "0 0 20px rgba(255, 179, 0, 0.4)",
      }}
    >
      <ShoppingCart className="h-7 w-7" />
      <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {totalItems}
      </span>
    </button>
  )
}
