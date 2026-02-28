"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { MapPin, Star, ChevronDown } from "lucide-react"

export function Hero() {
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
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-burger.jpg"
          alt="Hamburguesa premium de La Mordida Fusa con queso derretido y ingredientes frescos"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pt-24 pb-16 lg:px-8">
        {/* Badges */}
        <div
          data-animate
          className="mb-6 flex flex-wrap items-center gap-3 opacity-0"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="flex items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-1.5 text-xs font-semibold text-secondary">
            <MapPin className="h-3 w-3" />
            Fusagasuga, Colombia
          </span>
          <span className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <span className="ml-1">4.9/5</span>
          </span>
        </div>

        {/* Heading */}
        <h1
          data-animate
          className="mb-4 max-w-2xl font-serif text-5xl leading-tight tracking-wide text-foreground uppercase sm:text-6xl lg:text-8xl opacity-0"
          style={{ animationDelay: "0.3s" }}
        >
          El sabor que
          <span className="text-primary"> te atrapa</span>
        </h1>

        {/* Subheadline */}
        <p
          data-animate
          className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground lg:text-xl opacity-0"
          style={{ animationDelay: "0.5s" }}
        >
          Hamburguesas artesanales con ingredientes frescos, queso derretido y
          el sabor de calle que solo encuentras en La Mordida. Domicilios en
          toda Fusagasuga.
        </p>

        {/* CTAs */}
        <div
          data-animate
          className="flex flex-col gap-4 sm:flex-row opacity-0"
          style={{ animationDelay: "0.7s" }}
        >
          <a
            href="https://wa.me/573001234567?text=Hola!%20Quiero%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground uppercase tracking-wide transition-all hover:bg-primary/90 hover:scale-105 animate-pulse-glow"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pedir Ahora
          </a>
          <a
            href="#menu"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-transparent px-8 py-4 text-base font-bold text-secondary uppercase tracking-wide transition-all hover:bg-secondary hover:text-secondary-foreground"
          >
            Ver Menu
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center lg:justify-start">
          <a
            href="#destacados"
            className="flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Ver productos destacados"
          >
            <span className="text-xs uppercase tracking-widest">Descubre</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
