"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Minus, Plus, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  useCart, 
  parsePrice, 
  type ProductUnit,
  type ProductSelections,
  ADICIONES,
  ADICION_PRICE,
  SELECCION_PROTEINAS,
  SELECCION_VEGETALES,
  SELECCION_SALSAS,
} from "@/components/cart-context"

// ---------- SelectionGroup (para proteina, vegetal, salsa) ----------

interface SelectionGroupProps {
  title: string
  options: string[]
  value: string | undefined
  onChange: (value: string) => void
  required?: boolean
}

function SelectionGroup({ title, options, value, onChange, required }: SelectionGroupProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        {title}
        {required && <span className="text-destructive">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              value === option
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/30"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- AdicionesSelector ----------

interface AdicionesSelectorProps {
  selectedAdiciones: string[]
  onToggle: (adicion: string) => void
}

function AdicionesSelector({ selectedAdiciones, onToggle }: AdicionesSelectorProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
        Adiciones
        <span className="text-xs font-normal text-secondary normal-case">
          (+${ADICION_PRICE.toLocaleString("es-CO")} c/u)
        </span>
      </h4>
      <div className="space-y-2">
        {ADICIONES.map((adicion) => {
          const isSelected = selectedAdiciones.includes(adicion)
          return (
            <label
              key={adicion}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                isSelected
                  ? "border-secondary bg-secondary/10"
                  : "border-border bg-card hover:border-secondary/30"
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(adicion)}
              />
              <span className="flex-1 text-sm text-foreground">{adicion}</span>
              <span className="text-xs text-secondary font-medium">
                +${ADICION_PRICE.toLocaleString("es-CO")}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

// ---------- UnitConfigurator (memoized) ----------

interface UnitConfiguratorProps {
  index: number
  unit: ProductUnit
  ingredients: string[]
  proteins: string[]
  requiresSelections?: boolean
  selectionsType?: "salchipapa" | "perro"
  onProteinChange: (index: number, protein: string) => void
  onIngredientToggle: (index: number, ingredient: string, checked: boolean) => void
  onAdicionToggle: (index: number, adicion: string) => void
  onSelectionChange: (index: number, key: keyof ProductSelections, value: string) => void
}

const UnitConfigurator = memo(function UnitConfigurator({
  index,
  unit,
  ingredients,
  proteins,
  requiresSelections,
  selectionsType,
  onProteinChange,
  onIngredientToggle,
  onAdicionToggle,
  onSelectionChange,
}: UnitConfiguratorProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
        Producto {index + 1}
      </h4>

      {/* Selecciones requeridas para Salchipapas y Perros */}
      {requiresSelections && (
        <div className="mb-4 rounded-lg bg-muted/50 p-3">
          <p className="mb-3 text-xs font-semibold text-primary uppercase tracking-wide">
            Selecciona tus opciones
          </p>
          
          <SelectionGroup
            title="Proteina"
            options={SELECCION_PROTEINAS}
            value={unit.selecciones?.proteina}
            onChange={(val) => onSelectionChange(index, "proteina", val)}
            required
          />
          
          <SelectionGroup
            title="Vegetal"
            options={SELECCION_VEGETALES}
            value={unit.selecciones?.vegetal}
            onChange={(val) => onSelectionChange(index, "vegetal", val)}
            required
          />
          
          {selectionsType === "perro" && (
            <SelectionGroup
              title="Salsa"
              options={SELECCION_SALSAS}
              value={unit.selecciones?.salsa}
              onChange={(val) => onSelectionChange(index, "salsa", val)}
              required
            />
          )}
        </div>
      )}

      {/* Proteina del producto (si no tiene selecciones requeridas) */}
      {!requiresSelections && proteins.length > 0 && (
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
        <div className="mb-4">
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

      {/* Adiciones */}
      <AdicionesSelector
        selectedAdiciones={unit.adiciones}
        onToggle={(adicion) => onAdicionToggle(index, adicion)}
      />
    </div>
  )
})

// ---------- ProductModal ----------

function createUnit(protein: string, requiresSelections?: boolean): ProductUnit {
  return {
    id: Math.random().toString(36).slice(2, 9),
    protein,
    removedIngredients: [],
    adiciones: [],
    selecciones: requiresSelections ? {} : undefined,
  }
}

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addConfiguredUnits } = useCart()
  const [units, setUnits] = useState<ProductUnit[]>([])
  const [quantity, setQuantity] = useState(1)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Reset al abrir un producto nuevo
  useEffect(() => {
    if (selectedProduct) {
      const defaultProtein = selectedProduct.proteins[0] || ""
      setUnits([createUnit(defaultProtein, selectedProduct.requiresSelections)])
      setQuantity(1)
      setValidationError(null)
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
            createUnit(defaultProtein, selectedProduct?.requiresSelections)
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

  const handleAdicionToggle = useCallback((index: number, adicion: string) => {
    setUnits((prev) =>
      prev.map((u, i) => {
        if (i !== index) return u
        const isSelected = u.adiciones.includes(adicion)
        const newAdiciones = isSelected
          ? u.adiciones.filter((a) => a !== adicion)
          : [...u.adiciones, adicion]
        return { ...u, adiciones: newAdiciones }
      })
    )
  }, [])

  const handleSelectionChange = useCallback(
    (index: number, key: keyof ProductSelections, value: string) => {
      setUnits((prev) =>
        prev.map((u, i) => {
          if (i !== index) return u
          return {
            ...u,
            selecciones: {
              ...u.selecciones,
              [key]: value,
            },
          }
        })
      )
      setValidationError(null)
    },
    []
  )

  if (!selectedProduct) return null

  const priceNum = parsePrice(selectedProduct.price)
  
  // Calcular precio total incluyendo adiciones
  const totalAdiciones = units.reduce((acc, unit) => acc + unit.adiciones.length * ADICION_PRICE, 0)
  const totalPrice = (priceNum * quantity) + totalAdiciones

  function validateSelections(): boolean {
    if (!selectedProduct?.requiresSelections) return true

    for (let i = 0; i < units.length; i++) {
      const unit = units[i]
      if (!unit.selecciones?.proteina) {
        setValidationError(`Por favor selecciona una proteina para el producto ${i + 1}`)
        return false
      }
      if (!unit.selecciones?.vegetal) {
        setValidationError(`Por favor selecciona un vegetal para el producto ${i + 1}`)
        return false
      }
      if (selectedProduct.selectionsType === "perro" && !unit.selecciones?.salsa) {
        setValidationError(`Por favor selecciona una salsa para el producto ${i + 1}`)
        return false
      }
    }
    return true
  }

  function handleAddToCart() {
    if (!validateSelections()) return

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
              requiresSelections={selectedProduct.requiresSelections}
              selectionsType={selectedProduct.selectionsType}
              onProteinChange={handleProteinChange}
              onIngredientToggle={handleIngredientToggle}
              onAdicionToggle={handleAdicionToggle}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </div>

        {/* Error de validacion */}
        {validationError && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {validationError}
          </div>
        )}

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
