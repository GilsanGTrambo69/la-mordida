"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Flame, Star } from "lucide-react"

const products = [
  {
    name: "Hamburguesa Clásica + Papas",
    description: "Pan brioche artesanal, 150g de carne artesanal, salsa de la casa, cabello de ángel, tocineta, 50g de queso doble crema, tomate y papas.",
    price: "$20.000",
    image: "/images/burger-classic.jpg",
    badge: "Mas vendida",
  },
  {
    name: "Smash Carne y Panceta + Papas",
    description: "Pan brioche, lechuga, 150g de carne artesanal, 100g de queso doble crema, crema, 100g de panceta, tomate, tocineta, salsas de la casa y papas.",
    price: "$28.000",
    image: "/images/burger-bbq.jpg",
    badge: "Favorita",
  },
  {
    name: "Perro Personal",
    description: "Pan brioche, chorizo o salchicha, cabello de ángel, pico de gallo, hogao colombiano o lechuga, 50g de proteína a elección, salsa a elección y queso fundido.",
    price: "$16.000",
    image: "/images/hot-dog.jpg",
    badge: "Popular",
  },
  {
    name: "Salchipapa Clasica Personal",
    description: "Papas, salsas de la casa, salchicha, lechuga, 200g de proteína a elección (máximo 2 proteínas), cabello de ángel y queso cheddar.",
    price: "$37.000",
    image: "/images/salchipapa.jpg",
    badge: "Brutal",
  },
  {
    name: "Papa Chip",
    description: "Papas, salsas de la casa, salchicha, lechuga, 100g de proteína a elección, cabello de ángel, pico de gallo, hogao o chimichurri y queso cheddar.",
    price: "$25.000",
    image: "/images/combo-meal.jpg",
    badge: "Recomendado",
  },
]

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null)

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

    const elements = sectionRef.current?.querySelectorAll("[data-animate]")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="destacados"
      className="relative py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <div
            data-animate
            className="mb-4 flex items-center justify-center gap-2 opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Lo mas pedido
            </span>
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <h2
            data-animate
            className="font-serif text-4xl tracking-wide text-foreground uppercase sm:text-5xl lg:text-6xl opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Nuestros <span className="text-secondary">Favoritos</span>
          </h2>
          <p
            data-animate
            className="mx-auto mt-4 max-w-md text-base text-muted-foreground leading-relaxed opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            Los platos que nuestros clientes no pueden dejar de pedir.
            Preparados al momento, con todo el sabor.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <div
              key={product.name}
              data-animate
              className="group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(198,40,40,0.15)] opacity-0"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={`${product.name} - Comida rapida La Mordida Fusa`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                {/* Badge */}
                <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground uppercase">
                  <Flame className="h-3 w-3" />
                  {product.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-2 flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3 w-3 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <h3 className="mb-1 font-serif text-xl tracking-wide text-foreground uppercase">
                  {product.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">
                    {product.price}
                  </span>
                  <a
                    href={`https://wa.me/573001234567?text=Hola!%20Quiero%20pedir%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground uppercase tracking-wide transition-all hover:bg-primary/90 hover:scale-105"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
