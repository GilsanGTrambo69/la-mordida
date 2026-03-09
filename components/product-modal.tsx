"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Minus, Plus, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart, parsePrice, type ProductUnit, type Addition } from "@/components/cart-context"

// ---------- Constants ----------

const ADDITION_PRICE = 6000

const ADDITIONS_LIST = [
  "Carne desmechada",
  "Panceta al barril",
  "Pollo desmechado",
  "Cerdo desmechado",
  "Costilla ahumada",
]

// Adicionales específicos para perros (incluye papas)
const PERRO_ADDITIONS_LIST = [
  "Carne desmechada",
  "Panceta al barril",
  "Pollo desmechado",
  "Cerdo desmechado",
  "Costilla ahumada",
  "Papas",
]

const VEGETABLE_OPTIONS = [
  "Pico de gallo",
  "Hogao colombiano",
  "Lechuga",
]

// Salsas base
const BASE_SAUCE_OPTIONS = [
  "Salsa de tomate",
  "Salsa BBQ",
  "Salsa de ajo",
  "Mostaza",
]

// Salsas con chimichurri (para salchipapa clásica, papas chip, perro personal y perro+salchipapa)
const SAUCE_OPTIONS_WITH_CHIMICHURRI = [
  "Salsa de tomate",
  "Salsa BBQ",
  "Salsa de ajo",
  "Mostaza",
  "Chimichurri",
]

// Función para determinar qué salsas mostrar según el producto
function getSauceOptionsForProduct(productName: string): string[] {
  const nameLower = productName.toLowerCase()
  const needsChimichurri = 
    nameLower.includes("salchipapa clasica") || 
    nameLower.includes("papa chip") ||
    nameLower.includes("perro personal") ||
    nameLower.includes("perro") // Todos los perros incluyen chimichurri
  
  return needsChimichurri ? SAUCE_OPTIONS_WITH_CHIMICHURRI : BASE_SAUCE_OPTIONS
}

// Función para determinar si es un producto tipo perro (para adicionales)
function isPerroProduct(productName: string): boolean {
  return productName.toLowerCase().includes("perro")
}

// Función para determinar si el producto permite múltiples proteínas (máximo 2)
function allowsMultipleProteins(productName: string): boolean {
  const nameLower = productName.toLowerCase()
  return nameLower.includes("salchipapa clasica")
}

function requiresSelections(productName: string): { vegetable: boolean; sauce: boolean } {
  const nameLower = productName.toLowerCase()
  const isPerro = nameLower.includes("perro")
  // Salchicosteña NO tiene opción de vegetales
  const isSalchicosteña = nameLower.includes("salchicosteña")
  // Hamburguesas NO tienen opción de vegetales ni salsas
  const isHamburguesa = nameLower.includes("hamburguesa") || nameLower.includes("smash")
  const isSalchipapa = nameLower.includes("salchipapa") || nameLower.includes("papa chip")
  // Entradas (Panceta, Patacones) NO tienen opciones
  const isEntrada = nameLower.includes("panceta") || nameLower.includes("patacones")
  
  return {
    // Vegetales solo para perros y salchipapas (excepto salchicosteña, hamburguesas y entradas)
    vegetable: (isPerro || isSalchipapa) && !isSalchicosteña && !isHamburguesa && !isEntrada,
    // Salsas para perros y salchipapas (excepto hamburguesas y entradas)
    sauce: (isPerro || isSalchipapa) && !isHamburguesa && !isEntrada,
  }
}

// ---------- UnitConfigurator (memoized) ----------

interface UnitConfiguratorProps {
  index: number
  unit: ProductUnit
  ingredients: string[]
  proteins: string[]
  requiresVegetable: boolean
  requiresSauce: boolean
  showAdditions: boolean
  sauceOptions: string[]
  additionsList: string[]
  allowMultipleProteins: boolean
  maxProteins: number
  onProteinChange: (index: number, protein: string) => void
  onProteinToggle: (index: number, protein: string, checked: boolean) => void
  onIngredientToggle: (index: number, ingredient: string, checked: boolean) => void
  onAdditionToggle: (index: number, additionName: string, checked: boolean) => void
  onVegetableChange: (index: number, vegetable: string) => void
  onSauceToggle: (index: number, sauce: string, checked: boolean) => void
}

const UnitConfigurator = memo(function UnitConfigurator({
  index,
  unit,
  ingredients,
  proteins,
  requiresVegetable,
  requiresSauce,
  showAdditions,
  sauceOptions,
  additionsList,
  allowMultipleProteins,
  maxProteins,
  onProteinChange,
  onProteinToggle,
  onIngredientToggle,
  onAdditionToggle,
  onVegetableChange,
  onSauceToggle,
}: UnitConfiguratorProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground uppercase tracking-wide">
        Producto {index + 1}
      </h4>

      {/* Proteina */}
      {proteins.length > 0 && !allowMultipleProteins && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Proteina <span className="text-destructive">*</span>
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

      {/* Proteinas múltiples (máximo 2) */}
      {proteins.length > 0 && allowMultipleProteins && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Proteinas <span className="text-muted-foreground">(máximo {maxProteins})</span> <span className="text-destructive">*</span>
          </p>
          <div className="space-y-2">
            {proteins.map((protein) => {
              const isSelected = unit.proteins?.includes(protein) || false
              const isDisabled = !isSelected && (unit.proteins?.length || 0) >= maxProteins
              return (
                <label
                  key={protein}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : isDisabled
                        ? "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                        : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={(checked) =>
                      onProteinToggle(index, protein, !!checked)
                    }
                  />
                  <span className={`text-sm ${isDisabled ? "text-muted-foreground" : "text-foreground"}`}>{protein}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Vegetable Selection */}
      {requiresVegetable && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Vegetal <span className="text-destructive">*</span>
          </p>
          <RadioGroup
            value={unit.selectedVegetable || ""}
            onValueChange={(val) => onVegetableChange(index, val)}
            className="gap-2"
          >
            {VEGETABLE_OPTIONS.map((veg) => (
              <label
                key={veg}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                  unit.selectedVegetable === veg
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value={veg} />
                <span className="text-sm text-foreground">{veg}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Sauce Selection - Multiple options */}
      {requiresSauce && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Salsas <span className="text-muted-foreground">(selecciona una o varias)</span> <span className="text-destructive">*</span>
          </p>
          <div className="space-y-2">
            {sauceOptions.map((sauce) => {
              const isSelected = unit.selectedSauces?.includes(sauce) || false
              return (
                <label
                  key={sauce}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onSauceToggle(index, sauce, !!checked)
                    }
                  />
                  <span className="text-sm text-foreground">{sauce}</span>
                </label>
              )
            })}
          </div>
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
      {showAdditions && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Adiciones <span className="text-secondary">(+$6.000 c/u)</span>
          </p>
          <div className="space-y-2">
            {additionsList.map((addition) => {
              const isSelected = unit.additions.some(a => a.name === addition)
              return (
                <button
                  type="button"
                  key={addition}
                  onClick={() => onAdditionToggle(index, addition, !isSelected)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                    isSelected
                      ? "border-secondary bg-secondary/10"
                      : "border-border bg-card hover:border-secondary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm text-foreground">{addition}</span>
                  </div>
                  <span className="text-xs font-semibold text-secondary">+$6.000</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
})

// ---------- ProductModal ----------

function createUnit(protein: string, allowMultiple: boolean = false): ProductUnit {
  return {
    id: Math.random().toString(36).slice(2, 9),
    protein: allowMultiple ? "" : protein,
    proteins: allowMultiple ? [] : undefined,
    removedIngredients: [],
    additions: [],
    selectedVegetable: undefined,
    selectedSauces: [],
  }
}

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addConfiguredUnits } = useCart()
  const [units, setUnits] = useState<ProductUnit[]>([])
  const [quantity, setQuantity] = useState(1)

// Reset al abrir un producto nuevo
  useEffect(() => {
    if (selectedProduct) {
      const allowMultiple = allowsMultipleProteins(selectedProduct.name)
      const defaultProtein = selectedProduct.proteins[0] || ""
      setUnits([createUnit(defaultProtein, allowMultiple)])
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
          const allowMultiple = selectedProduct ? allowsMultipleProteins(selectedProduct.name) : false
          const defaultProtein = selectedProduct?.proteins[0] || ""
          const toAdd = Array.from({ length: newQty - prev.length }, () =>
            createUnit(defaultProtein, allowMultiple)
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

  const handleProteinToggle = useCallback((index: number, protein: string, checked: boolean) => {
    setUnits((prev) =>
      prev.map((u, i) => {
        if (i !== index) return u
        const currentProteins = u.proteins || []
        const newProteins = checked
          ? [...currentProteins, protein]
          : currentProteins.filter((p) => p !== protein)
        return { ...u, proteins: newProteins }
      })
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

  const handleAdditionToggle = useCallback(
    (index: number, additionName: string, checked: boolean) => {
      setUnits((prev) =>
        prev.map((u, i) => {
          if (i !== index) return u
          const additions = checked
            ? [...u.additions, { name: additionName, price: ADDITION_PRICE }]
            : u.additions.filter((a) => a.name !== additionName)
          return { ...u, additions }
        })
      )
    },
    []
  )

  const handleVegetableChange = useCallback((index: number, vegetable: string) => {
    setUnits((prev) =>
      prev.map((u, i) => (i === index ? { ...u, selectedVegetable: vegetable } : u))
    )
  }, [])

  const handleSauceToggle = useCallback((index: number, sauce: string, checked: boolean) => {
    setUnits((prev) =>
      prev.map((u, i) => {
        if (i !== index) return u
        const currentSauces = u.selectedSauces || []
        const newSauces = checked
          ? [...currentSauces, sauce]
          : currentSauces.filter((s) => s !== sauce)
        return { ...u, selectedSauces: newSauces }
      })
    )
  }, [])

  if (!selectedProduct) return null

  const priceNum = parsePrice(selectedProduct.price)
  const selections = requiresSelections(selectedProduct.name)
  
  // Determine if additions should be shown (not for bebidas or entradas)
  const showAdditions = selectedProduct.category !== "bebidas" && selectedProduct.category !== "entradas"
  
  // Calculate total with additions
  const totalAdditions = units.reduce((sum, unit) => {
    return sum + unit.additions.reduce((s, a) => s + a.price, 0)
  }, 0)
  const totalPrice = (priceNum * quantity) + totalAdditions

// Get sauce options and additions list for this product
  const sauceOptions = getSauceOptionsForProduct(selectedProduct.name)
  const additionsList = isPerroProduct(selectedProduct.name) ? PERRO_ADDITIONS_LIST : ADDITIONS_LIST
  const allowMultipleProteins = allowsMultipleProteins(selectedProduct.name)
  const maxProteins = 2

  // Validation
  const isValid = units.every((unit) => {
    // Para productos con múltiples proteínas, verificar que tenga al menos 1
    const hasProtein = selectedProduct.proteins.length === 0 || 
      (allowMultipleProteins ? (unit.proteins && unit.proteins.length >= 1) : unit.protein)
    const hasVegetable = !selections.vegetable || unit.selectedVegetable
    const hasSauce = !selections.sauce || (unit.selectedSauces && unit.selectedSauces.length > 0)
    return hasProtein && hasVegetable && hasSauce
  })

  function handleAddToCart() {
    if (!isValid) return
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
              requiresVegetable={selections.vegetable}
              requiresSauce={selections.sauce}
              showAdditions={showAdditions}
              sauceOptions={sauceOptions}
              additionsList={additionsList}
              allowMultipleProteins={allowMultipleProteins}
              maxProteins={maxProteins}
              onProteinChange={handleProteinChange}
              onProteinToggle={handleProteinToggle}
              onIngredientToggle={handleIngredientToggle}
              onAdditionToggle={handleAdditionToggle}
              onVegetableChange={handleVegetableChange}
              onSauceToggle={handleSauceToggle}
            />
          ))}
        </div>

        {/* Validation message */}
        {!isValid && (
          <p className="text-center text-sm text-destructive">
            Por favor selecciona todas las opciones requeridas marcadas con *
          </p>
        )}

        {/* Boton agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={!isValid}
          className="w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground uppercase tracking-wide transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Agregar al carrito - {formatPrice(totalPrice)}
        </button>
      </DialogContent>
    </Dialog>
  )
}
