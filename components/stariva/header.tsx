"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const catalogNav = [
  {
    label: "Одежда",
    href: "/catalog/clothes",
    desc: "Платья, топы, накидки",
    accent: "#b85c38",
  },
  {
    label: "Интерьер",
    href: "/catalog/interior",
    desc: "Абажуры, вигвамы",
    accent: "#7a6e5f",
  },
  {
    label: "Декор",
    href: "/catalog/decor",
    desc: "Панно, плейсменты, кашпо",
    accent: "#8c7b6b",
  },
]

const nav = [
  { label: "Каталог", href: "/catalog", hasMega: true },
  { label: "Мастер-классы", href: "/workshops" },
  { label: "Блог", href: "/blog" },
  { label: "О бренде", href: "/#story" },
  { label: "Доставка", href: "/#delivery" },
]

interface HeaderProps {
  variant?: "transparent" | "solid"
}

export function Header({ variant = "solid" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const isSolid = variant === "solid" || scrolled

  useEffect(() => {
    if (variant === "solid") return
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [variant])

  useEffect(() => {
    setMenuOpen(false)
    setMegaOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 120)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isSolid
            ? "bg-parchment/97 backdrop-blur-md border-b border-espresso/8"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between h-[60px] lg:h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group" aria-label="Stariva — на главную">
            <span className={`flex flex-col items-start leading-none transition-colors ${isSolid ? "text-espresso" : "text-white"}`}>
              {/* Wordmark */}
              <span
                className="font-serif tracking-[0.12em] uppercase"
                style={{ fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 500, letterSpacing: "0.14em" }}
              >
                Stariva
              </span>
              {/* Decorative rule — macrame thread motif */}
              <span className="flex items-center gap-[3px] mt-[3px]" aria-hidden="true">
                <span className={`block h-px w-[38px] transition-all duration-500 group-hover:w-[52px] ${isSolid ? "bg-terracotta" : "bg-white/60"}`} />
                <span className={`block h-px w-[6px] ${isSolid ? "bg-espresso/25" : "bg-white/30"}`} />
                <span className={`block h-px w-[3px] ${isSolid ? "bg-espresso/15" : "bg-white/20"}`} />
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) =>
              item.hasMega ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-md label-caps-md transition-colors flex items-center gap-1.5 ${
                      isActive(item.href)
                        ? "text-terracotta"
                        : isSolid
                        ? "text-espresso/70 hover:text-espresso"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  {/* Mega dropdown */}
                  <div
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                      megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="bg-parchment border border-espresso/10 rounded-xl shadow-[0_8px_40px_rgba(44,36,27,0.10)] p-2 w-64">
                      {catalogNav.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className={`flex items-start gap-3 px-3 py-3 rounded-lg group hover:bg-sand transition-colors ${
                            pathname.startsWith(cat.href) ? "bg-sand" : ""
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-[6px] flex-shrink-0"
                            style={{ backgroundColor: cat.accent }}
                          />
                          <div>
                            <div className="text-espresso font-medium text-[13px] group-hover:text-terracotta transition-colors">
                              {cat.label}
                            </div>
                            <div className="text-taupe text-[11px] mt-0.5">{cat.desc}</div>
                          </div>
                        </Link>
                      ))}
                      <div className="mt-1 pt-1 border-t border-espresso/8">
                        <Link
                          href="/catalog"
                          className="flex items-center justify-between px-3 py-2.5 text-taupe hover:text-terracotta label-caps text-[10px] transition-colors"
                        >
                          Весь каталог
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md label-caps-md transition-colors relative ${
                    isActive(item.href)
                      ? "text-terracotta"
                      : isSolid
                      ? "text-espresso/70 hover:text-espresso"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right: CTA + Burger */}
          <div className="flex items-center gap-3">
            <Link
              href="/#order"
              className={`hidden lg:inline-flex items-center gap-2 label-caps-md px-5 py-2 rounded-full transition-all ${
                isSolid
                  ? "bg-terracotta text-parchment hover:bg-terracotta-dark"
                  : "bg-white/15 border border-white/40 text-white hover:bg-white hover:text-espresso"
              }`}
            >
              Заказать
            </Link>

            {/* Burger */}
            <button
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenuOpen((v) => !v)}
              className={`lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-full border transition-colors ${
                isSolid
                  ? "border-espresso/15 text-espresso"
                  : "border-white/30 text-white"
              }`}
            >
              <span className={`block h-px w-[18px] bg-current transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px w-[18px] bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px w-[18px] bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-[300px] bg-parchment shadow-2xl flex flex-col transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 h-[60px] border-b border-espresso/8">
            <span className="font-serif text-xl text-espresso">Stariva</span>
            <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-espresso/50 hover:text-espresso">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
            {/* Catalog sub-links */}
            <div className="label-caps text-taupe text-[10px] px-1 mb-2">Каталог</div>
            {catalogNav.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 px-1 border-b border-espresso/6 group"
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.accent }} />
                <div>
                  <div className="text-espresso text-[15px]">{cat.label}</div>
                  <div className="text-taupe text-[11px]">{cat.desc}</div>
                </div>
              </Link>
            ))}

            <div className="mt-4 label-caps text-taupe text-[10px] px-1 mb-2">Навигация</div>
            {[{ label: "Весь каталог", href: "/catalog" }, { label: "Блог", href: "/blog" }, { label: "О нас", href: "/#story" }, { label: "Заказать", href: "/#order" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-1 border-b border-espresso/6 flex items-center justify-between group ${
                  isActive(item.href) ? "text-terracotta" : "text-espresso/80"
                }`}
              >
                <span className="font-serif text-[17px]">{item.label}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-25 group-hover:opacity-60 transition-opacity">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
