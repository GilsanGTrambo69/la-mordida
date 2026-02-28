"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Flame, Star } from "lucide-react"

const products = [
  {
    name: "La Clasica Mordida",
    description: "Doble carne, queso cheddar fundido, lechuga crespa, tomate y nuestra salsa secreta.",
    price: "$18.900",
    image: "/images/burger-classic.jpg",
    badge: "Mas vendida",
  },
  {
    name: "BBQ Bacon Smash",
    description: "Carne smash, tocineta crocante, cebolla caramelizada y salsa BBQ ahumada.",
    price: "$22.500",
    image: "/images/burger-bbq.jpg",
    badge: "Favorita",
  },
  {
    name: "La Bestia Triple",
    description: "Triple carne, triple queso, jalapenos, salsa picante y pan artesanal tostado.",
    price: "$28.900",
    image: "/images/burger-special.jpg",
    badge: "Para valientes",
  },
  {
    name: "Perro Loco",
    description: "Salchicha premium, queso derretido, papas crocantes, salsas y ripio.",
    price: "$14.500",
    image: "/images/hot-dog.jpg",
    badge: "Popular",
  },
  {
    name: "Salchipapa Monstruo",
    description: "Papa gruesa, salchicha, queso, salsas rosada, ketchup y mostaza. Porcion generosa.",
    price: "$16.900",
    image: "/images/salchipapa.jpg",
    badge: "Brutal",
  },
  {
    name: "Combo Familiar",
    description: "2 hamburguesas clasicas + papas grandes + 2 gaseosas. Ideal para compartir.",
    price: "$42.900",
    image: "/images/combo-meal.jpg",
    badge: "Ahorra $10K",
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
