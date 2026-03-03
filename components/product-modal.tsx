"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart, parsePrice, type ProductForModal } from "@/components/cart-context"

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addItem } = useCart()
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([])
  const [selectedProtein, setSelectedProtein] = useState("")
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (selectedProduct) {
      setRemovedIngredients([])
      setSelectedProtein(selectedProduct.proteins[0] || "")
      setQuantity(1)
    }
  }, [selectedProduct])

  if (!selectedProduct) return null

  const priceNum = parsePrice(selectedProduct.price)
  const totalPrice = priceNum * quantity

  function handleIngredientToggle(ingredient: string, checked: boolean) {
    if (checked) {
      setRemovedIngredients((prev) => prev.filter((i) => i !== ingredient))
    } else {
      setRemovedIngredients((prev) => [...prev, ingredient])
    }
  }

  function handleAddToCart() {
    const item = {
      id: `${selectedProduct!.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: selectedProduct!.name,
      image: selectedProduct!.image,
      price: priceNum,
      protein: selectedProtein,
      removedIngredients,
      quantity,
    }
    addItem(item)
    setSelectedProduct(null)
  }

  function formatPrice(value: number): string {
    return `$${value.toLocaleString("es-CO")}`
  }

  return (
    <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-wide text-foreground uppercase">
            {selectedProduct.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {selectedProduct.description}
          </DialogDescription>
        </DialogHeader>

        {/* Imagen del producto */}
        {/*
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={selectedProduct.image}
            alt={selectedProduct.name}
            fill
            className="object-cover"
            sizes="(max-width: 448px) 100vw, 448px"
          />
        </div> */}

        {/* Precio */}
        <div className="text-center">
          <span className="text-3xl font-bold text-secondary">
            {selectedProduct.price}
          </span>
        </div>

        {/* Ingredientes */}
        {selectedProduct.ingredients.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
              Ingredientes
            </h4>
            <div className="space-y-2">
              {selectedProduct.ingredients.map((ingredient) => {
                const isRemoved = removedIngredients.includes(ingredient)
                return (
                  <label
                    key={ingredient}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      isRemoved
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border bg-background hover:border-primary/30"
                    }`}
                  >
                    <Checkbox
                      checked={!isRemoved}
                      onCheckedChange={(checked) =>
                        handleIngredientToggle(ingredient, !!checked)
                      }
                    />
                    <span
                      className={`text-sm ${
                        isRemoved
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {isRemoved ? `Sin ${ingredient.toLowerCase()}` : ingredient}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Proteina */}
        {selectedProduct.proteins.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
              Proteina
            </h4>
            <RadioGroup
              value={selectedProtein}
              onValueChange={setSelectedProtein}
              className="gap-2"
            >
              {selectedProduct.proteins.map((protein) => (
                <label
                  key={protein}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    selectedProtein === protein
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem value={protein} />
                  <span className="text-sm text-foreground">{protein}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Cantidad */}
        <div>
          <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
            Cantidad
          </h4>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary/30 hover:bg-muted disabled:opacity-50"
              disabled={quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] text-center text-2xl font-bold text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary/30 hover:bg-muted"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Boton agregar al carrito */}
        <button
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground uppercase tracking-wide transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          Agregar al carrito - {formatPrice(totalPrice)}
        </button>
      </DialogContent>
    </Dialog>
  )
}
