"use client"

import Image from "next/image"
import { Trash2, MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCart } from "@/components/cart-context"
import { ScrollArea } from "@/components/ui/scroll-area"

const WHATSAPP_NUMBER = "573212750685"

function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-CO")}`
}

function buildWhatsAppMessage(
  items: { name: string; protein: string; removedIngredients: string[]; quantity: number; price: number }[],
  total: number
): string {
  let msg = "Pedido:\n\n"

  for (const item of items) {
    msg += `${item.quantity} ${item.name}\n`
    if (item.protein) {
      msg += `Proteina: ${item.protein}\n`
    }
    if (item.removedIngredients.length > 0) {
      msg += item.removedIngredients.map((i) => `Sin ${i.toLowerCase()}`).join("\n") + "\n"
    }
    msg += "\n"
  }

  msg += `Total: ${formatPrice(total)}`

  return msg
}

export function CartModal() {
  const { items, removeItem, clearCart, totalPrice, cartOpen, setCartOpen } = useCart()

  function handleWhatsApp() {
    const message = buildWhatsAppMessage(items, totalPrice)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={cartOpen} onOpenChange={setCartOpen}>
      <DialogContent className="max-h-[90vh] bg-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-wide text-foreground uppercase">
            Tu Pedido
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {items.length === 0
              ? "Tu carrito esta vacio"
              : `${items.length} producto${items.length > 1 ? "s" : ""} en tu carrito`}
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Agrega productos desde el menu
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[50vh] pr-2">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-wide leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Eliminar ${item.name} del carrito`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {item.protein && (
                        <p className="text-xs text-muted-foreground">
                          Proteina: <span className="text-foreground">{item.protein}</span>
                        </p>
                      )}

                      {item.removedIngredients.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {item.removedIngredients.map((ing) => (
                            <span
                              key={ing}
                              className="rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive"
                            >
                              Sin {ing.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Cant: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-secondary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-bold text-foreground uppercase tracking-wide">
                Total
              </span>
              <span className="text-2xl font-bold text-secondary">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3.5 text-sm font-bold text-foreground uppercase tracking-wide transition-all hover:bg-[#22bf5b] hover:scale-[1.02] active:scale-[0.98]"
                style={{ color: "#fff" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pedir por WhatsApp
              </button>
              <button
                onClick={() => {
                  clearCart()
                  setCartOpen(false)
                }}
                className="w-full rounded-lg border border-border px-6 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide transition-colors hover:border-destructive/30 hover:text-destructive hover:bg-destructive/5"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
