"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X } from "lucide-react"
import { useCart } from "@/components/cart-context"

export function CartFloatButton() {
  const { totalItems, setCartOpen } = useCart()
  const [visible, setVisible] = useState(false)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      {!tooltipDismissed && (
        <div className="relative flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-3 shadow-lg">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Haz tu pedido</span>
            <br />
            <span className="text-xs text-muted-foreground">Respuesta inmediata</span>
          </p>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="ml-1 text-muted-foreground hover:text-foreground"
            aria-label="Cerrar tooltip"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 border-b border-r border-border bg-card" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label={`Abrir carrito${totalItems > 0 ? ` con ${totalItems} productos` : ""}`}
        style={{
          boxShadow: "0 0 20px rgba(255, 179, 0, 0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 30px rgba(255, 179, 0, 0.6)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 179, 0, 0.4)"
        }}
      >
        <ShoppingCart className="h-7 w-7" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  )
}
