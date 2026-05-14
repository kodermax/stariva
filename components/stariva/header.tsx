"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TelegramIcon, WhatsappIcon } from "./icons"

const nav = [
  { label: "Каталог", href: "/catalog" },
  { label: "Блог", href: "/blog" },
  { label: "О бренде", href: "/#story" },
  { label: "Доставка", href: "/#delivery" },
  { label: "Заказать", href: "/#order" },
]

interface HeaderProps {
  /** "transparent" — для главной hero-страницы; "solid" — для внутренних страниц */
  variant?: "transparent" | "solid"
}

export function Header({ variant = "transparent" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isSolid = variant === "solid" || scrolled

  useEffect(() => {
    if (variant === "solid") return
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [variant])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const textColor = isSolid ? "text-espresso" : "text-white"
  const textColorMuted = isSolid ? "text-espresso/60" : "text-white/70"
  const borderColor = isSolid ? "border-espresso/12" : "border-white/20"
  const hoverColor = isSolid ? "hover:text-terracotta" : "hover:text-white"

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
          isSolid
            ? "bg-parchment/95 backdrop-blur-md border-b border-espresso/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link
            href="/"
            className={`font-serif text-2xl lg:text-[28px] tracking-tight transition-colors ${textColor}`}
          >
            Stariva
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`label-caps-md transition-colors relative pb-0.5 ${
                    active
                      ? isSolid
                        ? "text-terracotta"
                        : "text-white"
                      : `${textColorMuted} ${hoverColor}`
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-px ${
                        isSolid ? "bg-terracotta" : "bg-white"
                      }`}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right side: socials + mobile toggle */}
          <div className="flex items-center gap-2">
            <a
              href="https://t.me/stariva"
              aria-label="Telegram"
              className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full border transition-colors ${borderColor} ${textColorMuted} ${
                isSolid
                  ? "hover:border-terracotta hover:text-terracotta"
                  : "hover:border-white hover:text-white"
              }`}
            >
              <TelegramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/79990000000"
              aria-label="WhatsApp"
              className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full border transition-colors ${borderColor} ${textColorMuted} ${
                isSolid
                  ? "hover:border-terracotta hover:text-terracotta"
                  : "hover:border-white hover:text-white"
              }`}
            >
              <WhatsappIcon className="w-4 h-4" />
            </a>

            {/* Mobile hamburger */}
            <button
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenuOpen((v) => !v)}
              className={`lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-full transition-colors ${
                isSolid
                  ? "text-espresso hover:bg-sand"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-espresso/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-parchment shadow-2xl flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-espresso/10">
            <span className="font-serif text-xl text-espresso">Stariva</span>
            <button
              aria-label="Закрыть меню"
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-espresso/60 hover:text-espresso"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-6 py-8 flex flex-col gap-1">
            {nav.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3.5 border-b border-espresso/6 flex items-center justify-between group ${
                    active ? "text-terracotta" : "text-espresso/80 hover:text-espresso"
                  }`}
                >
                  <span className="font-serif text-lg">{item.label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-30 group-hover:opacity-60 transition-opacity">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )
            })}
          </nav>

          <div className="px-6 pb-8 flex items-center gap-3">
            <a
              href="https://t.me/stariva"
              aria-label="Telegram"
              className="flex w-10 h-10 items-center justify-center rounded-full border border-espresso/12 text-espresso/60 hover:border-terracotta hover:text-terracotta transition-colors"
            >
              <TelegramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/79990000000"
              aria-label="WhatsApp"
              className="flex w-10 h-10 items-center justify-center rounded-full border border-espresso/12 text-espresso/60 hover:border-terracotta hover:text-terracotta transition-colors"
            >
              <WhatsappIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
