"use client"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { FullMenu } from "@/components/full-menu"
import { Promotions } from "@/components/promotions"
import { Testimonials } from "@/components/testimonials"
import { InstagramFeed } from "@/components/instagram-feed"
import { LocationContact } from "@/components/location-contact"
import { Footer } from "@/components/footer"

import { CartProvider } from "@/components/cart-context"
import { ProductModal } from "@/components/product-modal"
import { CartFloatButton } from "@/components/cart-float-button"
import { CartModal } from "@/components/cart-modal"

export default function HomePage() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <FullMenu />
        <Promotions />
        <Testimonials />
        <InstagramFeed />
        <LocationContact />
      </main>
      <Footer />
      
      <CartFloatButton />
      <ProductModal />
      <CartModal />
    </CartProvider>
  )
}
