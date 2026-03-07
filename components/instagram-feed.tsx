"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Instagram, Heart, MessageCircle } from "lucide-react"

const posts = [
  {
    image: "/images/Hamburguesa-clasica-con-salchipapa.jpeg",
    likes: "342",
    comments: "28",
    alt: "Hamburguesa clasica La Mordida Fusa",
  },
  {
    image: "/images/Hamburguesa-mordida-tropical.jpeg",
    likes: "489",
    comments: "45",
    alt: "Tropical Mordida burger La Mordida Fusa",
  },
  {
    image: "/images/salchicosteña-personal.jpeg",
    likes: "267",
    comments: "19",
    alt: "Salchicosteña La Mordida Fusa",
  },
  {
    image: "/images/salchipapa-clasica-duo.jpeg",
    likes: "521",
    comments: "63",
    alt: "La Bestia Triple La Mordida Fusa",
  },
  {
    image: "/images/Perro-personal.jpeg",
    likes: "198",
    comments: "15",
    alt: "Perro loco La Mordida Fusa",
  },
  {
    image: "/images/Papas-chip.jpeg",
    likes: "376",
    comments: "32",
    alt: "Combo familiar La Mordida Fusa",
  },
]

export function InstagramFeed() {
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
    <section ref={sectionRef} className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <div
            data-animate
            className="mb-4 flex items-center justify-center gap-2 opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            <Instagram className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              @lamordidafusa
            </span>
          </div>
          <h2
            data-animate
            className="font-serif text-4xl tracking-wide text-foreground uppercase sm:text-5xl lg:text-6xl opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Siguenos en <span className="text-secondary">Instagram</span>
          </h2>
          <p
            data-animate
            className="mx-auto mt-4 max-w-md text-base text-muted-foreground leading-relaxed opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            No te pierdas nuestras publicaciones, promos exclusivas y el
            contenido que te abre el apetito.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <a
              key={i}
              href="https://www.instagram.com/lamordidafusa"
              target="_blank"
              rel="noopener noreferrer"
              data-animate
              className="group relative aspect-square overflow-hidden rounded-xl opacity-0"
              style={{ animationDelay: `${0.2 + i * 0.08}s` }}
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-1 text-sm font-semibold text-primary-foreground">
                  <Heart className="h-4 w-4 fill-current" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-primary-foreground">
                  <MessageCircle className="h-4 w-4 fill-current" />
                  {post.comments}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div
          data-animate
          className="mt-10 flex justify-center opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="https://www.instagram.com/lamordidafusa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-transparent px-8 py-4 text-base font-bold text-primary uppercase tracking-wide transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Instagram className="h-5 w-5" />
            Siguenos en Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
