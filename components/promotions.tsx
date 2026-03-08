"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Clock, Zap } from "lucide-react"

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

  // Set promo deadline 
  const promoDeadline = new Date("2026-03-15T23:59:59")

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
                Solo hasta el 15 de marzo
              </span>
              <h3 className="mb-3 font-serif text-3xl tracking-wide text-foreground uppercase sm:text-4xl lg:text-5xl">
                1 Perro  + 1 Papa Chip + 2 Jugos Hit a solo 45.000
              </h3>
              <p className="mb-6 text-base text-foreground/80 leading-relaxed">
                En el Mes de la Mujer celebramos su fuerza, alegría y sabor único con un combo
                irresistible: 1 perro caliente lleno de sabor, papa chip crocante y 2 jugos Hit
                para compartir y brindar por ellas. Una promoción especial para consentir,
                celebrar y disfrutar en grande. Disponible solo en el local hasta el 15 de marzo.
              </p>
              <div className="mb-6 flex items-center gap-2 text-sm text-foreground/70">
                <Clock className="h-4 w-4" />
                <span>La promo se acaba en:</span>
              </div>
              <CountdownTimer targetDate={promoDeadline} />
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/573212750685?text=Hola!%20Quiero%20aprovechar%20la%20promo%20del%20%20mes%20de%20la%20mujer"
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
              perro caliente personal + salchipapas por 23.000. El combo perfecto para calmar tu antojo sin vaciar tu bolsillo. ¡Sabor brutal a un precio imbatible!
            </p>
            <div className="flex items-center gap-3">
              {/*
              <span className="text-sm text-muted-foreground line-through">
                $50.900
              </span> */}
              <span className="text-2xl font-bold text-secondary">
                $38.900
              </span>
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
