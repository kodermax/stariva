import { Header } from "@/components/stariva/header"
import { Hero } from "@/components/stariva/hero"
import { Marquee } from "@/components/stariva/marquee"
import { FeaturedCollection } from "@/components/stariva/featured-collection"
import { Reviews } from "@/components/stariva/reviews"
import { Atmosphere } from "@/components/stariva/atmosphere"
import { Process } from "@/components/stariva/process"
import { PaymentDelivery } from "@/components/stariva/payment-delivery"
import { CustomOrder } from "@/components/stariva/custom-order"
import { Footer } from "@/components/stariva/footer"
import { MobileStickyBar } from "@/components/stariva/mobile-sticky-bar"

export default function Page() {
  return (
    <main className="bg-parchment text-espresso">
      <Header variant="solid" />
      <Hero />
      <Marquee />
      <FeaturedCollection />
      <Reviews />
      <Atmosphere />
      <Process />
      <PaymentDelivery />
      <CustomOrder />
      <Footer />
      <MobileStickyBar />
    </main>
  )
}
