"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TelegramIcon, WhatsappIcon } from "./icons"

const nav = [
  { label: "Каталог", href: "/catalog" },
  { label: "Блог", href: "/blog" },
  { label: "О бренде", href: "/#story" },
  { label: "Доставка", href: "/#delivery" },
  { label: "Заказать", href: "/#order" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-parchment/90 backdrop-blur-md border-b border-espresso/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl lg:text-3xl tracking-tight text-espresso">Stariva</span>
          <span className="hidden md:inline label-caps text-taupe">est. 2018</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-caps-md text-espresso/80 hover:text-terracotta transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://t.me/stariva"
            aria-label="Telegram"
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-espresso/15 text-espresso/80 hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <TelegramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/79990000000"
            aria-label="WhatsApp"
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-espresso/15 text-espresso/80 hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <WhatsappIcon className="w-4 h-4" />
          </a>
          <Link
            href="/catalog"
            className="label-caps-md px-4 py-2.5 rounded-full border border-espresso text-espresso hover:bg-espresso hover:text-parchment transition-colors"
          >
            Каталог
          </Link>
        </div>
      </div>
    </header>
  )
}
