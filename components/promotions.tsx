"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Clock, Zap, ShoppingCart } from "lucide-react"
import { useCart, type ProductForModal } from "@/components/cart-context"

// ============================================
// CONFIGURACION DEL COMBO BESTIA
// Cambia estos valores para actualizar el combo destacado
// ============================================
const COMBO_BESTIA_CONFIG = {
  // Nombre del combo (como aparece en el menu)
  name: "Smash Carne y Panceta + Salchipapas",
  // Descripcion corta para la tarjeta
  description: "Pan brioche, 150g de carne artesanal, queso cheddar, queso fundido, 100g de panceta, tocineta al barril, salsas de la casa y salchipapas.",
  // Precio del combo
  price: "$33.000",
  // Imagen del producto
  image: "/images/Hamburguesa-smash-con-panceta.jpeg",
  // Ingredientes del producto
  ingredients: ["Pan brioche", "150g carne artesanal", "Queso fundido", "Queso cheddar", "100g panceta", "Tocineta al barril", "Salsa de ajo de la casa", "Salchipapa personal"],
  // Proteinas disponibles (vacio si no aplica)
  proteins: [] as string[],
  // Categoria del producto
  category: "combos" as const,
  // Precio mostrado en la tarjeta (puede ser diferente al precio real si hay descuento)
  displayPrice: "$33.000",
  // Precio anterior tachado (opcional, dejar vacio si no hay descuento)
  previousPrice: "",
}

// ============================================
// CONFIGURACION DE LA PROMOCION PRINCIPAL
// ============================================
const PROMO_PRINCIPAL_CONFIG = {
  // Titulo de la promocion
  title: "1 Perro  + 1 Papa Chip + 2 Jugos Hit a solo 45.000",
  // Precio de la promocion (se incluira en el mensaje de WhatsApp)
  price: "$45.000",
  // Descripcion
  description: "En el Mes de la Mujer celebramos su fuerza, alegría y sabor único con un combo irresistible: 1 perro caliente lleno de sabor, papa chip crocante y 2 jugos Hit para compartir y brindar por ellas. Una promoción especial para consentir, celebrar y disfrutar en grande. Disponible solo en el local hasta el 15 de marzo.",
  // Fecha limite de la promocion
  deadline: "2026-03-15T23:59:59",
  // Etiqueta superior
  badge: "Solo hasta el 15 de marzo",
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const diff = targetDate.getTime() - now

      if (diff <= 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const units = [
    { label: "Dias", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-background/20 text-2xl font-bold text-foreground backdrop-blur-sm">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-foreground/70">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Promotions() {
  const sectionRef = useRef<HTMLElement>(null)
  const { setSelectedProduct } = useCart()

  // Set promo deadline from config
  const promoDeadline = new Date(PROMO_PRINCIPAL_CONFIG.deadline)

  // Funcion para abrir el modal del combo bestia
  function handleComboBestiaClick() {
    const product: ProductForModal = {
      name: COMBO_BESTIA_CONFIG.name,
      description: COMBO_BESTIA_CONFIG.description,
      price: COMBO_BESTIA_CONFIG.price,
      image: COMBO_BESTIA_CONFIG.image,
      ingredients: COMBO_BESTIA_CONFIG.ingredients,
      proteins: COMBO_BESTIA_CONFIG.proteins,
      category: COMBO_BESTIA_CONFIG.category,
    }
    setSelectedProduct(product)
  }

  // URL de WhatsApp con precio incluido
  const whatsappUrl = `https://wa.me/573212750685?text=Hola!%20Quiero%20aprovechar%20la%20promo%20del%20mes%20de%20la%20mujer%20por%20${encodeURIComponent(PROMO_PRINCIPAL_CONFIG.price)}`

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
    <section ref={sectionRef} id="promos" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <div
            data-animate
            className="mb-4 flex items-center justify-center gap-2 opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            <Zap className="h-5 w-5 text-secondary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
              Ofertas de la semana
            </span>
            <Zap className="h-5 w-5 text-secondary" />
          </div>
          <h2
            data-animate
            className="font-serif text-4xl tracking-wide text-foreground uppercase sm:text-5xl lg:text-6xl opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Mes de la <span className="text-primary">Mujer</span>
          </h2>
        </div>

        {/* Main promo banner */}
        <div
          data-animate
          className="relative overflow-hidden rounded-3xl opacity-0"
          style={{ animationDelay: "0.3s" }}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="/images/promo-banner.jpg"
              alt="Promocion especial La Mordida Fusa"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-14">
            <div className="max-w-lg">
              <span className="mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-xs font-bold text-secondary-foreground uppercase">
                {PROMO_PRINCIPAL_CONFIG.badge}
              </span>
              <h3 className="mb-3 font-serif text-3xl tracking-wide text-foreground uppercase sm:text-4xl lg:text-5xl">
                {PROMO_PRINCIPAL_CONFIG.title}
              </h3>
              <p className="mb-6 text-base text-foreground/80 leading-relaxed">
                {PROMO_PRINCIPAL_CONFIG.description}
              </p>
              <div className="mb-6 flex items-center gap-2 text-sm text-foreground/70">
                <Clock className="h-4 w-4" />
                <span>La promo se acaba en:</span>
              </div>
              <CountdownTimer targetDate={promoDeadline} />
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground uppercase tracking-wide transition-all hover:bg-secondary/90 hover:scale-105"
              >
                Aprovechar Promo
              </a>
              <span className="text-center text-xs text-foreground/60">
                *Aplican terminos y condiciones
              </span>
            </div>
          </div>
        </div>

        {/* Secondary promos */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div
            data-animate
            className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-secondary/40 opacity-0"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="mb-2 inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary uppercase">
              Combo ahorro
            </span>
            <h3 className="mb-2 font-serif text-2xl tracking-wide text-foreground uppercase">
              Combo Bestia
            </h3>
            <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
              {COMBO_BESTIA_CONFIG.name}. El combo perfecto para calmar tu antojo sin vaciar tu bolsillo.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {COMBO_BESTIA_CONFIG.previousPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {COMBO_BESTIA_CONFIG.previousPrice}
                  </span>
                )}
                <span className="text-2xl font-bold text-secondary">
                  {COMBO_BESTIA_CONFIG.displayPrice}
                </span>
              </div>
              <button
                onClick={handleComboBestiaClick}
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground uppercase transition-all hover:bg-secondary/90 hover:scale-105"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar
              </button>
            </div>
          </div>

          <div
            data-animate
            className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 opacity-0"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase">
              Domicilio gratis
            </span>
            <h3 className="mb-2 font-serif text-2xl tracking-wide text-foreground uppercase">
              Envio sin costo
            </h3>
            <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
              En pedidos mayores a $35.000 el domicilio es completamente gratis en
              toda Fusagasuga. Sin excusas para no pedir.
            </p>
            <span className="text-2xl font-bold text-primary">$0 Domicilio</span>
          </div>
        </div>
      </div>
    </section>
  )
}
