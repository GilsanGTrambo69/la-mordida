"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { useCart, type ProductForModal } from "@/components/cart-context"

type Category = "todos" | "hamburguesas" | "perros" | "salchipapas" | "combos" | "bebidas"

interface MenuItem {
  name: string
  description: string
  price: string
  image: string
  category: Category
  ingredients: string[]
  proteins: string[]
  requiresSelections?: boolean
  selectionsType?: "salchipapa" | "perro"
}

const categories: { key: Category; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "hamburguesas", label: "Hamburguesas" },
  { key: "perros", label: "Perros Calientes" },
  { key: "salchipapas", label: "Salchipapas" },
  { key: "combos", label: "Combos" },
  { key: "bebidas", label: "Bebidas" },
]

const menuItems: MenuItem[] = [
  {
    name: "Hamburguesa Clásica + Papas",
    description: "Pan brioche artesanal, 150g de carne artesanal, salsa de la casa, cabello de ángel, tocineta, 50g de queso doble crema, tomate y papas.",
    price: "$20.000",
    image: "/images/burger-classic.jpg",
    category: "hamburguesas",
    ingredients: ["Salsa de la casa", "Cabello de angel", "Tocineta", "Queso doble crema", "Tomate"],
    proteins: ["Carne", "Pollo", "Mixta"],
  },
  {
    name: "Smash Carne y Panceta + Papas",
    description: "Pan brioche, lechuga, 150g de carne artesanal, 100g de queso doble crema, crema, 100g de panceta, tomate, tocineta, salsas de la casa y papas.",
    price: "$28.000",
    image: "/images/burger-bbq.jpg",
    category: "hamburguesas",
    ingredients: ["Lechuga", "Queso doble crema", "Crema", "Panceta", "Tomate", "Tocineta", "Salsas de la casa"],
    proteins: ["Carne", "Pollo", "Mixta"],
  },
  {
    name: "Perro Personal",
    description: "Pan brioche, chorizo o salchicha, cabello de ángel, pico de gallo, hogao colombiano o lechuga, 50g de proteína a elección, salsa a elección y queso fundido.",
    price: "$16.000",
    image: "/images/hot-dog.jpg",
    category: "perros",
    ingredients: ["Cabello de angel", "Pico de gallo", "Queso fundido"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "perro",
  },
  {
    name: "Perro Jumbo (37cm)",
    description: "Pan brioche, cabello de ángel, salchicha o chorizo (a elección), pico de gallo, hogao colombiano o lechuga, 230g de proteína a elección (máximo 2 proteínas), salsa a elección, 150g de queso fundido.",
    price: "$40.000",
    image: "/images/hot-dog.jpg",
    category: "perros",
    ingredients: ["Cabello de angel", "Pico de gallo", "Queso fundido"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "perro",
  },
  {
    name: "Salchipapa Clasica Personal",
    description: "Papas, salsas de la casa, salchicha, lechuga, 100g de proteína a elección (máximo 2 proteínas), cabello de ángel y queso fundido.",
    price: "$21.000",
    image: "/images/salchipapa.jpg",
    category: "salchipapas",
    ingredients: ["Salsas de la casa", "Lechuga", "Cabello de angel", "Queso fundido"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "salchipapa",
  },
  {
    name: "Salchipapa Clasica para Dos Personas",
    description: "Papas, salsas de la casa, salchicha, lechuga, 200g de proteína a elección (máximo 2 proteínas), cabello de ángel y queso cheddar.",
    price: "$37.000",
    image: "/images/salchipapa.jpg",
    category: "salchipapas",
    ingredients: ["Salsas de la casa", "Lechuga", "Cabello de angel", "Queso cheddar"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "salchipapa",
  },
  {
    name: "Salchicosteña Personal",
    description: "Papas, salsas de la casa, salchicha, 80g de proteína a elección, suero costeño, cabello de ángel, lechuga, queso fundido y zanahoria.",
    price: "$21.000",
    image: "/images/salchipapa.jpg",
    category: "salchipapas",
    ingredients: ["Salsas de la casa", "Suero costeno", "Cabello de angel", "Lechuga", "Queso fundido", "Zanahoria"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "salchipapa",
  },
  {
    name: "Salchicosteña Personal para Dos Personas",
    description: "Papas, salsas de la casa, salchicha, zanahoria, 150g de proteína a elección, suero costeño, cabello de ángel, lechuga y queso fundido.",
    price: "$37.000",
    image: "/images/salchipapa.jpg",
    category: "salchipapas",
    ingredients: ["Salsas de la casa", "Zanahoria", "Suero costeno", "Cabello de angel", "Lechuga", "Queso fundido"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "salchipapa",
  },
  {
    name: "Papa Chip",
    description: "Papas, salsas de la casa, salchicha, lechuga, 100g de proteína a elección, cabello de ángel, pico de gallo, hogao o chimichurri y queso cheddar.",
    price: "$25.000",
    image: "/images/combo-meal.jpg",
    category: "salchipapas",
    ingredients: ["Salsas de la casa", "Lechuga", "Cabello de angel", "Pico de gallo", "Queso cheddar"],
    proteins: [],
    requiresSelections: true,
    selectionsType: "salchipapa",
  },
  {
    name: "Combo Bestia",
    description: "Bestia Triple + papas grandes + gaseosa + postre.",
    price: "$38.900",
    image: "/images/combo-meal.jpg",
    category: "combos",
    ingredients: [],
    proteins: ["Carne", "Pollo", "Mixta"],
  },
  {
    name: "Gaseosa",
    description: "Coca-Cola, Sprite o Colombiana. 400ml.",
    price: "$4.500",
    image: "/images/drinks.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
  {
    name: "Jugo Natural",
    description: "Limonada de panela, jugo de maracuya o lulo.",
    price: "$6.500",
    image: "/images/drinks.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
  {
    name: "Malteada",
    description: "Chocolate, fresa o vainilla. Con crema batida.",
    price: "$9.900",
    image: "/images/drinks.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
]

export function FullMenu() {
  const [activeCategory, setActiveCategory] = useState<Category>("todos")
  const sectionRef = useRef<HTMLElement>(null)
  const { setSelectedProduct } = useCart()

  function handleProductClick(item: MenuItem) {
    const product: ProductForModal = {
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      ingredients: item.ingredients,
      proteins: item.proteins,
      requiresSelections: item.requiresSelections,
      selectionsType: item.selectionsType,
    }
    setSelectedProduct(product)
  }

  const filteredItems =
    activeCategory === "todos"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 }
    )

    const el = sectionRef.current?.querySelector("[data-animate-header]")
    if (el) observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="menu" className="relative bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div
          data-animate-header
          className="mb-12 text-center opacity-0"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-secondary">
            Nuestro Menu
          </span>
          <h2 className="font-serif text-4xl tracking-wide text-foreground uppercase sm:text-5xl lg:text-6xl">
            Elige tu <span className="text-primary">antojo</span>
          </h2>
        </div>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleProductClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleProductClick(item) }}
              className="group flex cursor-pointer items-start gap-4 rounded-xl bg-background border border-border p-4 transition-all duration-300 hover:border-primary/30"
            >
              {/* Thumbnail */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={`${item.name} - Menu La Mordida Fusa`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="80px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="mb-0.5 text-sm font-bold text-foreground uppercase tracking-wide">
                  {item.name}
                </h3>
                <div className="mb-1 flex items-center gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-2.5 w-2.5 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <p className="mb-2 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-secondary">
                    {item.price}
                  </span>
                  <span
                    className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase transition-all hover:bg-primary/90"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Agregar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
