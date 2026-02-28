"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Camila Rodriguez",
    text: "Las mejores hamburguesas que he probado en Fusa, sin exagerar. El queso derretido de La Clasica es otro nivel. Ya es tradicion de cada viernes.",
    rating: 5,
    initials: "CR",
  },
  {
    name: "Andres Gutierrez",
    text: "Pedi la Bestia Triple y quede sin palabras. La porcion es brutalmente grande y el sabor es increible. 100% recomendado para los que les gusta comer bien.",
    rating: 5,
    initials: "AG",
  },
  {
    name: "Valentina Lopez",
    text: "El domicilio llego super rapido y caliente. La salchipapa monstruo es adictiva, las salsas son una locura. Se nota que todo es fresco.",
    rating: 5,
    initials: "VL",
  },
  {
    name: "Santiago Morales",
    text: "El combo familiar es perfecto para compartir. Mis hijos aman las hamburguesas y los precios son muy buenos para lo que ofrecen. Siempre volvemos.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Laura Martinez",
    text: "Me encanta la atencion y la rapidez. Pido por WhatsApp y en menos de 30 minutos ya estoy comiendo. El perro loco es mi favorito, las papas crocantes son geniales.",
    rating: 5,
    initials: "LM",
  },
  {
    name: "Felipe Torres",
    text: "La BBQ Bacon es una obra de arte. La tocineta crocante con la salsa BBQ ahumada es una combinacion perfecta. Mejor que muchas hamburgueserias de Bogota.",
    rating: 5,
    initials: "FT",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = Math.ceil(testimonials.length / 1)

  const startAutoplay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startAutoplay])

  const goTo = (direction: "prev" | "next") => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCurrentIndex((prev) =>
      direction === "next"
        ? (prev + 1) % testimonials.length
        : (prev - 1 + testimonials.length) % testimonials.length
    )
    startAutoplay()
  }

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

  // Show 1 on mobile, 2 on sm, 3 on lg
  const getVisibleTestimonials = () => {
    const items = []
    for (let i = 0; i < 3; i++) {
      items.push(testimonials[(currentIndex + i) % testimonials.length])
    }
    return items
  }

  const visibleItems = getVisibleTestimonials()

  return (
    <section ref={sectionRef} id="opiniones" className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span
            data-animate
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-primary opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            Lo que dicen nuestros clientes
          </span>
          <h2
            data-animate
            className="font-serif text-4xl tracking-wide text-foreground uppercase sm:text-5xl lg:text-6xl opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Sabor <span className="text-secondary">comprobado</span>
          </h2>
          <p
            data-animate
            className="mx-auto mt-4 max-w-md text-base text-muted-foreground leading-relaxed opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            Mas de 300 clientes satisfechos nos respaldan. Lee sus opiniones reales.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((testimonial, i) => (
              <div
                key={`${testimonial.name}-${currentIndex}-${i}`}
                className={`rounded-2xl border border-border bg-background p-6 transition-all duration-500 ${
                  i === 0 ? "block" : i === 1 ? "hidden sm:block" : "hidden lg:block"
                }`}
              >
                <Quote className="mb-4 h-8 w-8 text-primary/30" />
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-secondary text-secondary"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm text-foreground/90 leading-relaxed italic">
                  {`"${testimonial.text}"`}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cliente frecuente
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => goTo("prev")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (intervalRef.current) clearInterval(intervalRef.current)
                    setCurrentIndex(i)
                    startAutoplay()
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Ir a testimonio ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo("next")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
