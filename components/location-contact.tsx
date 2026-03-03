"use client"

import { useEffect, useRef } from "react"
import { MapPin, Clock, Phone, Navigation } from "lucide-react"

const schedule = [
  { day: "Lunes a Jueves", hours: "12:00 PM - 10:00 PM" },
  { day: "Viernes y Sabado", hours: "12:00 PM - 11:30 PM" },
  { day: "Domingo", hours: "12:00 PM - 9:00 PM" },
]

export function LocationContact() {
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
    <section ref={sectionRef} id="contacto" className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span
            data-animate
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-secondary opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            Visitanos o Escríbenos
          </span>
          <h2
            data-animate
            className="font-serif text-4xl tracking-wide text-foreground uppercase sm:text-5xl lg:text-6xl opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Donde <span className="text-primary">encontrarnos</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map */}
          <div
            data-animate
            className="overflow-hidden rounded-2xl border border-border opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d753!2d-74.3651509!3d4.3236262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMTknMjUuMSJOIDc0wrAyMSc1NC41Ilc!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicacion de La Mordida Fusa en Google Maps"
              className="h-[300px] w-full lg:h-full lg:min-h-[400px]"
            />
          </div>

          {/* Contact info + form */}
          <div className="flex flex-col gap-8">
            {/* Info cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div
                data-animate
                className="rounded-xl border border-border bg-background p-5 opacity-0"
                style={{ animationDelay: "0.3s" }}
              >
                <MapPin className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 text-sm font-bold text-foreground uppercase">
                  Direccion
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Centro de Fusagasuga, Cundinamarca, Colombia
                </p>
              </div>

              <div
                data-animate
                className="rounded-xl border border-border bg-background p-5 opacity-0"
                style={{ animationDelay: "0.4s" }}
              >
                <Phone className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 text-sm font-bold text-foreground uppercase">
                  WhatsApp
                </h3>
                <a
                  href="https://wa.me/573212750685?text=Hola!%20Quiero%20hacer%20un%20pedido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary hover:underline"
                >
                  +57 300 123 4567
                </a>
              </div>

              <div
                data-animate
                className="rounded-xl border border-border bg-background p-5 sm:col-span-2 opacity-0"
                style={{ animationDelay: "0.5s" }}
              >
                <Clock className="mb-3 h-6 w-6 text-secondary" />
                <h3 className="mb-2 text-sm font-bold text-foreground uppercase">
                  Horarios
                </h3>
                <div className="flex flex-col gap-1.5">
                  {schedule.map((item) => (
                    <div
                      key={item.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{item.day}</span>
                      <span className="font-medium text-foreground">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/573212750685?text=Hola!%20Quiero%20hacer%20un%20pedido"
                target="_blank"
                rel="noopener noreferrer"
                data-animate
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground uppercase tracking-wide transition-all hover:bg-primary/90 hover:scale-105 opacity-0"
                style={{ animationDelay: "0.6s" }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pedir por WhatsApp
              </a>
              <a
                href="https://www.google.com/maps/place/4%C2%B019'25.1%22N+74%C2%B021'54.5%22W/@4.3236262,-74.3677258,753m"
                target="_blank"
                rel="noopener noreferrer"
                data-animate
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-transparent px-6 py-4 text-sm font-bold text-secondary uppercase tracking-wide transition-all hover:bg-secondary hover:text-secondary-foreground opacity-0"
                style={{ animationDelay: "0.7s" }}
              >
                <Navigation className="h-4 w-4" />
                Como Llegar
              </a>
            </div>

            {/* Simple contact form */}
            <form
              data-animate
              className="rounded-2xl border border-border bg-background p-6 opacity-0"
              style={{ animationDelay: "0.8s" }}
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const name = (form.elements.namedItem("name") as HTMLInputElement).value
                const phone = (form.elements.namedItem("phone") as HTMLInputElement).value
                const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value
                window.open(
                  `https://wa.me/573212750685?text=${encodeURIComponent(`Hola! Soy ${name} (${phone}). ${message}`)}`,
                  "_blank"
                )
              }}
            >
              <h3 className="mb-4 text-sm font-bold text-foreground uppercase tracking-wide">
                Escribenos un mensaje
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Tu telefono"
                  required
                  className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <textarea
                  name="message"
                  placeholder="Tu mensaje..."
                  rows={3}
                  required
                  className="resize-none rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground uppercase tracking-wide transition-all hover:bg-primary/90"
                >
                  Enviar por WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
