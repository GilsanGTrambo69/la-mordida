"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { useCart, type ProductForModal } from "@/components/cart-context"

type Category = "todos" | "hamburguesas" | "perros" | "salchipapas" | "combos" | "bebidas" | "entradas"

interface MenuItem {
  name: string
  description: string
  price: string
  image: string
  category: Category
  ingredients: string[]
  proteins: string[]
}

const categories: { key: Category; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "hamburguesas", label: "Hamburguesas" },
  { key: "perros", label: "Perros Calientes" },
  { key: "salchipapas", label: "Salchipapas" },
  { key: "entradas", label: "Entradas" },
  { key: "combos", label: "Combos" },
  { key: "bebidas", label: "Bebidas" },
]

const menuItems: MenuItem[] = [
  // HAMBURGUESAS - Todas con queso fundido y sin opción de vegetales
  {
    name: "Hamburguesa doble carne + Papas",
    description: "Pan brioche, 150g de carne artesanal, queso fundido, panceta, tocineta, salsas de la casa y papas.",
    price: "$32.000",
    image: "/images/burger-bbq.jpg",
    category: "hamburguesas",
    ingredients: ["Pan brioche", "Salsa de ajo de la casa", "Doble tocineta", "Carne artesanal", "Queso fundido", "Queso cheddar", "Papas francesas"],
    proteins: [],
  },
  {
    name: "Hamburguesa mordida tropical + Papas",
    description: "Pan brioche, 150g de carne artesanal, queso fundido, piña asada, medallón de plátano maduro, suero costeño, salsas de la casa y papas.",
    price: "$28.000",
    image: "/images/Hamburguesa-mordida-tropical.jpeg",
    category: "hamburguesas",
    ingredients: ["Pan brioche", "Salsa de ajo de la casa", "Piña asada", "Carne artesanal", "Medallon de platano maduro", "Suero costeño", "Queso fundido", "Papas francesas"],
    proteins: [],
  },
  {
    name: "Hamburguesa sweet bite + Papas",
    description: "Pan brioche, 150g de carne artesanal, queso fundido, tocineta en reducción de vino tinto, salsas de la casa y papas.",
    price: "$28.000",
    image: "/images/Hamburguesa-sweet-bite.jpeg",
    category: "hamburguesas",
    ingredients: ["Pan brioche", "Salsa de ajo de la casa", "Carne artesanal", "Queso fundido", "Tocineta en reduccion de vino tinto", "Papas francesas"],
    proteins: [],
  },
  {
    name: "Hamburguesa Clásica + Salchipapas",
    description: "Pan brioche, 150g de carne artesanal, queso fundido, tocineta al barril, salsas de la casa y salchipapas.",
    price: "$25.000",
    image: "/images/Hamburguesa-clasica-con-salchipapa.jpeg",
    category: "hamburguesas",
    ingredients: ["Pan brioche", "150g carne artesanal", "Queso fundido", "Tocineta al barril", "Salsa de ajo de la casa", "Salchipapa"],
    proteins: [],
  },  
  {
    name: "Hamburguesa Clásica + Papas",
    description: "Pan brioche, 150g de carne artesanal, queso fundido, tocineta al barril, salsas de la casa y papas.",
    price: "$33.000",
    image: "/images/hamburguesa-papas.jpg",
    category: "hamburguesas",
    ingredients: ["Pan brioche", "150g carne artesanal", "Queso fundido", "Tocineta al barril", "Salsa de ajo de la casa", "Papas"],
    proteins: [],
  },
  // COMBOS
  {
    name: "Smash Carne y Panceta + Salchipapas",
    description: "Pan brioche, 150g de carne artesanal, queso cheddar, queso fundido, 100g de panceta, tocineta al barril, salsas de la casa y salchipapas.",
    price: "$33.000",
    image: "/images/Hamburguesa-smash-con-panceta.jpeg",
    category: "combos",
    ingredients: ["Pan brioche", "150g carne artesanal", "Queso fundido", "Queso cheddar", "100g panceta", "Tocineta al barril", "Salsa de ajo de la casa", "Salchipapa personal"],
    proteins: [],
  },
  {
    name: "Perro personal + salchipapa",
    description: "Pan brioche, cabello de ángel, salchicha o chorizo (a elección), pico de gallo, hogao colombiano o lechuga, salsa a elección, queso fundido y salchipapa.",
    price: "$23.000",
    image: "/images/perro-salchipapa.jpg",
    category: "combos",
    ingredients: ["Pan brioche", "Cabello de angel", "Queso fundido", "Salchipapa"],
    proteins: ["Chorizo", "Salchicha", "Carne desmechada", "Pollo desmechado", "Cerdo desmechado"],
  },
  // SALCHIPAPAS
  {
    name: "Salchipapa Clasica Personal",
    description: "Papas, salsas de la casa, salchicha, 100g de proteína a elección, cabello de ángel y queso fundido.",
    price: "$21.000",
    image: "/images/salchipapa.jpg",
    category: "salchipapas",
    ingredients: ["Papas", "Salchicha", "Cabello de angel", "Queso fundido"],
    proteins: ["Carne desmechada", "Pollo desmechado", "Cerdo desmechado", "Costilla ahumada", "Chorizo", "Panceta al barril"],
  },
  {
    name: "Salchipapa Clasica para Dos Personas",
    description: "Papas, salsas de la casa, salchicha, 200g de proteína a elección, cabello de ángel y queso fundido.",
    price: "$37.000",
    image: "/images/Salchipapa-clasica-duo.jpeg",
    category: "salchipapas",
    ingredients: ["Papas", "Salchicha", "Cabello de angel", "Queso fundido"],
    proteins: ["Carne desmechada", "Pollo desmechado", "Cerdo desmechado", "Costilla ahumada", "Chorizo", "Panceta al barril"],
  },
  {
    name: "Salchicosteña Personal",
    description: "Papas, salsas de la casa, salchicha, 80g de proteína a elección, suero costeño, cabello de ángel, lechuga y queso fundido.",
    price: "$21.000",
    image: "/images/Salchicosteña-personal.jpeg",
    category: "salchipapas",
    ingredients: ["Papas", "Salchicha", "Suero costeno", "Cabello de angel", "Lechuga", "Queso fundido"],
    proteins: ["Carne desmechada", "Pollo desmechado", "Cerdo desmechado", "Costilla ahumada", "Chorizo", "Panceta al barril"],
  },
  {
    name: "Salchicosteña para Dos Personas",
    description: "Papas, salsas de la casa, salchicha, 150g de proteína a elección, suero costeño, cabello de ángel, lechuga, queso fundido y zanahoria.",
    price: "$37.000",
    image: "/images/salchipapa.jpg",
    category: "salchipapas",
    ingredients: ["Papas", "Salchicha", "Suero costeno", "Cabello de angel", "Lechuga", "Queso fundido"],
    proteins: ["Carne desmechada", "Pollo desmechado", "Cerdo desmechado", "Costilla ahumada", "Chorizo", "Panceta al barril"],
  },
  {
    name: "Papa Chip",
    description: "Papas, salsas de la casa, salchicha, 100g de proteína a elección, cabello de ángel, pico de gallo, hogao o chimichurri y queso cheddar.",
    price: "$25.000",
    image: "/images/Papas-chip.jpeg",
    category: "salchipapas",
    ingredients: ["Papas", "Salchicha", "Cabello de angel", "Queso cheddar"],
    proteins: ["Carne desmechada", "Pollo desmechado", "Cerdo desmechado", "Costilla ahumada", "Chorizo", "Panceta al barril"],
  },
  // ENTRADAS
  {
    name: "Panceta de Cerdo al barril con Yuca",
    description: "Panceta de cerdo al barril, yuca y salsa de ajo de la casa.",
    price: "$15.000",
    image: "/images/panceta-cerdo-yuca.jpg",
    category: "entradas",
    ingredients: ["Panceta de cerdo al barril", "Yuca", "Salsa de ajo de la casa"],
    proteins: [],
  },
  {
    name: "Patacones con hogao",
    description: "Patacones con hogao.",
    price: "$10.000",
    image: "/images/patacon-hogao.jpg",
    category: "entradas",
    ingredients: ["Patacones", "Hogao"],
    proteins: [],
  },
  // PERROS
  {
    name: "Perro Personal",
    description: "Pan brioche, cabello de ángel, salchicha o chorizo (a elección), pico de gallo, vegetal de elección, salsa a elección.",
    price: "$18.000",
    image: "/images/Perro-personal.jpeg",
    category: "perros",
    ingredients: ["Pan brioche", "Cabello de angel"],
    proteins: ["Chorizo", "Salchicha", "Carne desmechada", "Pollo desmechado", "Cerdo desmechado"],
  },
  // BEBIDAS
  {
    name: "Agua",
    description: "",
    price: "$4.000",
    image: "/images/agua-cristal.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
  {
    name: "Jugo Hit",
    description: "",
    price: "$4.000",
    image: "/images/jugo-hit.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
  {
    name: "Coca Cola",
    description: "",
    price: "$4.000",
    image: "/images/coca-cola.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
  {
    name: "Club Colombia",
    description: "",
    price: "$5.000", 
    image: "/images/club-colombia.jpg",
    category: "bebidas",
    ingredients: [],
    proteins: [],
  },
  {
    name: "Budweiser",
    description: "",
    price: "$5.000",
    image: "/images/budweiser.jpg",
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
      category: item.category,
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
          {filteredItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
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
