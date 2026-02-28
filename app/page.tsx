import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { FullMenu } from "@/components/full-menu"
import { Promotions } from "@/components/promotions"
import { Testimonials } from "@/components/testimonials"
import { InstagramFeed } from "@/components/instagram-feed"
import { LocationContact } from "@/components/location-contact"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function HomePage() {
  return (
    <>
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
      <WhatsAppFloat />
    </>
  )
}
