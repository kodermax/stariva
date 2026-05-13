"use client"

import { useEffect, useState } from "react"
import { PhoneIcon, WhatsappIcon } from "./icons"

export function MobileStickyBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`lg:hidden fixed bottom-3 left-3 right-3 z-50 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="grid grid-cols-2 gap-2 bg-parchment/95 backdrop-blur-md border border-espresso/15 rounded-full p-1.5 shadow-[0_8px_30px_rgba(44,36,27,0.12)]">
        <a
          href="https://wa.me/79990000000"
          className="flex items-center justify-center gap-2 py-3 rounded-full bg-terracotta text-parchment label-caps-md"
        >
          <WhatsappIcon className="w-4 h-4" />
          Написать
        </a>
        <a
          href="tel:+79990000000"
          className="flex items-center justify-center gap-2 py-3 rounded-full border border-espresso text-espresso label-caps-md"
        >
          <PhoneIcon className="w-4 h-4" />
          Позвонить
        </a>
      </div>
    </div>
  )
}
