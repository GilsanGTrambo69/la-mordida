"use client"

import { useState, useEffect, useCallback, memo } from "react"
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
import { useCart, parsePrice, type ProductUnit } from "@/components/cart-context"

// ---------- UnitConfigurator (memoized) ----------

interface UnitConfiguratorProps {
  index: number
  unit: ProductUnit
  ingredients: string[]
  proteins: string[]
  onProteinChange: (index: number, protein: string) => void
  onIngredientToggle: (index: number, ingredient: string, checked: boolean) => void
}

const UnitConfigurator = memo(function UnitConfigurator({
  index,
  unit,
  ingredients,
  proteins,
  onProteinChange,
  onIngredientToggle,
}: UnitConfiguratorProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
        Producto {index + 1}
      </h4>

      {/* Proteina */}
      {proteins.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Proteina
          </p>
          <RadioGroup
            value={unit.protein}
            onValueChange={(val) => onProteinChange(index, val)}
            className="gap-2"
          >
            {proteins.map((protein) => (
              <label
                key={protein}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                  unit.protein === protein
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={protein} />
                <span className="text-sm text-foreground">{protein}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Ingredientes */}
      {ingredients.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Ingredientes
          </p>
          <div className="space-y-2">
            {ingredients.map((ingredient) => {
              const isRemoved = unit.removedIngredients.includes(ingredient)
              return (
                <label
                  key={ingredient}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    isRemoved
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <Checkbox
                    checked={!isRemoved}
                    onCheckedChange={(checked) =>
                      onIngredientToggle(index, ingredient, !!checked)
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
    </div>
  )
})

// ---------- ProductModal ----------

function createUnit(protein: string): ProductUnit {
  return {
    id: Math.random().toString(36).slice(2, 9),
    protein,
    removedIngredients: [],
  }
}

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addConfiguredUnits } = useCart()
  const [units, setUnits] = useState<ProductUnit[]>([])
  const [quantity, setQuantity] = useState(1)

  // Reset al abrir un producto nuevo
  useEffect(() => {
    if (selectedProduct) {
      const defaultProtein = selectedProduct.proteins[0] || ""
      setUnits([createUnit(defaultProtein)])
      setQuantity(1)
    }
  }, [selectedProduct])

  // Sincronizar unidades cuando cambia la cantidad
  const handleQuantityChange = useCallback(
    (newQty: number) => {
      if (newQty < 1) return
      setQuantity(newQty)

      setUnits((prev) => {
        if (newQty > prev.length) {
          const defaultProtein = selectedProduct?.proteins[0] || ""
          const toAdd = Array.from({ length: newQty - prev.length }, () =>
            createUnit(defaultProtein)
          )
          return [...prev, ...toAdd]
        }
        if (newQty < prev.length) {
          return prev.slice(0, newQty)
        }
        return prev
      })
    },
    [selectedProduct]
  )

  const handleProteinChange = useCallback((index: number, protein: string) => {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, protein } : u))
    )
  }, [])

  const handleIngredientToggle = useCallback(
    (index: number, ingredient: string, checked: boolean) => {
      setUnits((prev) =>
        prev.map((u, i) => {
          if (i !== index) return u
          const removed = checked
            ? u.removedIngredients.filter((ing) => ing !== ingredient)
            : [...u.removedIngredients, ingredient]
          return { ...u, removedIngredients: removed }
        })
      )
    },
    []
  )

  if (!selectedProduct) return null

  const priceNum = parsePrice(selectedProduct.price)
  const totalPrice = priceNum * quantity

  function handleAddToCart() {
    addConfiguredUnits(units, {
      name: selectedProduct!.name,
      image: selectedProduct!.image,
      price: priceNum,
    })
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

        {/* Precio */}
        <div className="text-center">
          <span className="text-3xl font-bold text-secondary">
            {selectedProduct.price}
          </span>
        </div>

        {/* Cantidad */}
        <div>
          <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
            Cantidad
          </h4>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
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
              onClick={() => handleQuantityChange(quantity + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:border-primary/30 hover:bg-muted"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Configuradores por unidad */}
        <div className="space-y-3">
          {units.map((unit, index) => (
            <UnitConfigurator
              key={unit.id}
              index={index}
              unit={unit}
              ingredients={selectedProduct.ingredients}
              proteins={selectedProduct.proteins}
              onProteinChange={handleProteinChange}
              onIngredientToggle={handleIngredientToggle}
            />
          ))}
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
