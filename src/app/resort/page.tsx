import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/stariva/footer";
import { Header } from "@/components/stariva/header";
import { PhoneIcon, TelegramIcon } from "@/components/stariva/icons";
import { BreadcrumbJsonLd } from "@/components/stariva/json-ld";
import { Reviews } from "@/components/stariva/reviews";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://stariva.ru";

export const metadata: Metadata = {
  title: "Макраме для баз отдыха и глэмпингов — Stariva",
  description:
    "Декор из макраме для баз отдыха, глэмпингов, загородных отелей и spa. Абажуры, панно, гамак-кресла, ширмы — корпоративные заказы с документами.",
  alternates: { canonical: `${BASE_URL}/resort` },
  openGraph: {
    type: "website",
    title: "Макраме для баз отдыха — Stariva",
    description:
      "Декор для баз отдыха, глэмпингов и загородных отелей. Натуральный хлопок, авторский дизайн, документы для бухгалтерии.",
    url: `${BASE_URL}/resort`,
    images: [
      {
        url: `${BASE_URL}/images/resort/hero.png`,
        width: 1200,
        height: 630,
        alt: "Макраме-декор для баз отдыха — Stariva",
      },
    ],
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const scenarios = [
  {
    image: "/images/resort/terrace.png",
    title: "Открытые террасы и беседки",
    body: "Макраме-занавески и ширмы из влагостойкого хлопка создают уют и защищают от ветра, не блокируя свет. Идеально для крытых веранд, зон барбекю и летних ресторанов.",
    tags: ["Ширмы", "Абажуры", "Зонирование"],
  },
  {
    image: "/images/resort/glamping.png",
    title: "Глэмпинг и эко-отели",
    body: "Панно и ловцы снов превращают типовой шатёр или домик в персонажную историю. Гости фотографируют и отмечают вас в социальных сетях — бесплатный органический охват.",
    tags: ["Панно", "Ловцы снов", "Настроение"],
  },
  {
    image: "/images/resort/reception.png",
    title: "Ресепшн и общественные зоны",
    body: "Большое фокусное панно над стойкой регистрации — первое впечатление гостя. Задаёт тон всему пространству и транслирует заботу о деталях.",
    tags: ["Арт-объекты", "Брендинг", "Фотозона"],
  },
  {
    image: "/images/resort/spa.png",
    title: "SPA и зоны релаксации",
    body: "Макраме-потолочные инсталляции создают ощущение уединения без стен. Натуральный хлопок визуально смягчает пространство, а плетение немного рассеивает звук.",
    tags: ["Потолочные инсталляции", "Акустика", "Уют"],
  },
];

const advantages = [
  {
    number: "01",
    title: "Подходит для улицы",
    body: "Специально обработанный хлопок для крытых уличных пространств. Переносит смену температур и влажность, сохраняя вид сезон за сезоном.",
  },
  {
    number: "02",
    title: "Под ваш стиль",
    body: "Эко, рустик, бохо, скандинавский минимализм — адаптируем узор, цвет и размер под концепцию вашей базы отдыха.",
  },
  {
    number: "03",
    title: "Контент-магнит",
    body: "Изделия из макраме создают инстаграм-точки сами по себе. Гости публикуют фото, отмечают заведение — вы получаете органический охват без рекламного бюджета.",
  },
  {
    number: "04",
    title: "Быстрый монтаж",
    body: "Все крепления продуманы заранее: деревянные жерди, кольца, потолочные зацепы. Монтаж одного изделия — 30–60 минут без специального инструмента.",
  },
  {
    number: "05",
    title: "Документы для бухгалтерии",
    body: "Работаем как ИП и ООО. Договор, счёт, акт выполненных работ, накладные — полный пакет для списания.",
  },
  {
    number: "06",
    title: "Оптовые условия",
    body: "При заказе от 5 изделий — скидка 15%. При заказе от 10 — индивидуальное ценообразование и приоритет в очереди производства.",
  },
];

const workSteps = [
  {
    step: "01",
    title: "Заявка и бриф",
    body: "Заполняете форму или пишете в Telegram. Рассказываете про пространство: размеры, стиль, фото. Мы готовим коммерческое предложение в течение 24 часов.",
  },
  {
    step: "02",
    title: "Концепция и утверждение",
    body: "Присылаем эскизы и раскладку по пространству. Вносим правки, согласовываем размеры и сроки. Подписываем договор.",
  },
  {
    step: "03",
    title: "Производство",
    body: "Плетём в нашей мастерской. Для заказов от 5 изделий — 3–5 недель. Регулярно отправляем фото прогресса.",
  },
  {
    step: "04",
    title: "Доставка и монтаж",
    body: "Доставляем по всей России. По Москве и области — помогаем с монтажом. Онлайн-инструкция и видеозвонок для самостоятельной установки.",
  },
];

const faq = [
  {
    q: "Выдержит ли макраме уличные условия?",
    a: "Наши изделия для крытых уличных пространств (терраса под навесом, беседка) сделаны из обработанного хлопка. Они хорошо переносят перепады температур и влажность. Для полностью открытых мест под прямым дождём не подходят — нужна защита навесом.",
  },
  {
    q: "Как скоро изготовите большой заказ?",
    a: "Стандартный срок для корпоративных заказов — 3–5 недель в зависимости от объёма. Экспресс-производство за доплату возможно для заказов до 3 изделий.",
  },
  {
    q: "Можно ли заказать изделие с логотипом или названием базы?",
    a: "Да. Буквы и логотипы вплетаются в панно. Требует дополнительного времени на разработку. Покажите ваш лого — сделаем эскиз.",
  },
  {
    q: "Работаете ли по всей России?",
    a: "Да, доставляем СДЭК и Почтой России по всей стране. Монтаж — по Москве и Московской области. Для других регионов — подробная видеоинструкция.",
  },
  {
    q: "Сколько стоит минимальный корпоративный заказ?",
    a: "Минимальный заказ — одно изделие. Оптовые условия начинаются от 3 изделий. Точную стоимость считаем по брифу — скачайте КП или напишите нам.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResortPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", url: `${BASE_URL}/` },
          { name: "Для бизнеса", url: `${BASE_URL}/b2b` },
          { name: "Базы отдыха", url: `${BASE_URL}/resort` },
        ]}
      />

      <Header variant="transparent" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/resort/hero.png"
            alt="Макраме-декор на террасе базы отдыха"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 via-near-black/30 to-transparent" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 lg:px-12 pb-16 lg:pb-24 pt-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="label-caps text-white/60 text-[10px]">
                Для бизнеса
              </span>
              <span className="w-6 h-px bg-white/30" />
              <span className="label-caps text-terracotta text-[10px]">
                Базы отдыха
              </span>
            </div>
            <h1
              className="font-serif text-white leading-[1.1] mb-6"
              style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
            >
              Макраме для баз отдыха,
              <br />
              глэмпингов и эко-отелей
            </h1>
            <p
              className="text-white/75 leading-relaxed mb-10 max-w-xl"
              style={{ fontSize: "clamp(15px, 1.5vw, 18px)" }}
            >
              Превращаем типовое пространство в атмосферное место, где гости
              задерживаются и возвращаются. Натуральный хлопок, авторский
              дизайн, монтаж под ключ.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/api/kp/resort"
                download="stariva-kp-bazy-otdykha.pdf"
                className="inline-flex items-center gap-3 bg-terracotta text-parchment px-7 py-3.5 rounded-full label-caps-md hover:bg-terracotta-dark transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 13.5h10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Скачать КП (PDF)
              </a>
              <a
                href="https://t.me/Olga_Stariva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/10 border border-white/25 text-white px-7 py-3.5 rounded-full label-caps-md hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Обсудить проект
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap gap-8 lg:gap-16">
            {[
              { value: "50+", label: "Проектов для отдыха" },
              { value: "15 лет", label: "Срок службы изделий" },
              { value: "24ч", label: "Подготовим КП" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-white text-3xl leading-none mb-1">
                  {s.value}
                </div>
                <div className="label-caps text-white/50 text-[10px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenarios ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-parchment">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
          <div className="mb-14">
            <p className="label-caps text-terracotta text-[10px] mb-4">
              Где используется
            </p>
            <h2
              className="font-serif text-near-black leading-tight max-w-xl"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Для каждого пространства — своё решение
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((s) => (
              <article
                key={s.title}
                className="group rounded-2xl overflow-hidden border border-espresso/8 hover:border-espresso/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(22,21,19,0.08)] bg-white"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-near-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="label-caps text-[9px] text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/25"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-near-black text-xl mb-3">
                    {s.title}
                  </h3>
                  <p className="text-dark-grey leading-relaxed text-[14px]">
                    {s.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Advantages ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
          <div className="mb-14">
            <p className="label-caps text-terracotta text-[10px] mb-4">
              Почему выбирают нас
            </p>
            <h2
              className="font-serif text-near-black leading-tight max-w-lg"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Шесть причин работать со Stariva
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((a) => (
              <div
                key={a.number}
                className="bg-white rounded-2xl p-7 border border-espresso/6 hover:border-espresso/14 transition-colors"
              >
                <div
                  className="font-serif text-terracotta/40 text-4xl leading-none mb-5 select-none"
                  aria-hidden="true"
                >
                  {a.number}
                </div>
                <h3 className="font-serif text-near-black text-[18px] leading-snug mb-3">
                  {a.title}
                </h3>
                <p className="text-dark-grey text-[13px] leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-espresso text-parchment">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
          <div className="mb-14">
            <p className="label-caps text-terracotta text-[10px] mb-4">
              Как работаем
            </p>
            <h2
              className="font-serif leading-tight max-w-lg"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              От заявки до готового объекта
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden">
            {workSteps.map((p, i) => (
              <div key={p.step} className="bg-espresso p-8 relative">
                {i < workSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-1/2 -right-px w-px h-12 -translate-y-1/2 bg-white/8"
                    aria-hidden="true"
                  />
                )}
                <div
                  className="font-serif text-terracotta/50 text-5xl leading-none mb-6 select-none"
                  aria-hidden="true"
                >
                  {p.step}
                </div>
                <h3 className="font-serif text-xl mb-3">{p.title}</h3>
                <p className="text-parchment/60 text-[13px] leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Download ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-sand">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="label-caps text-terracotta text-[10px] mb-4">
              Коммерческое предложение
            </p>
            <h2
              className="font-serif text-near-black leading-tight mb-6"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              Скачайте готовое КП
              <br />
              для вашего руководства
            </h2>
            <p className="text-dark-grey leading-relaxed mb-10 text-[15px] max-w-lg mx-auto">
              PDF с ценами, фотографиями изделий, сроками и условиями работы.
              Готов к отправке в WhatsApp, Telegram или по email — один клик.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/api/kp/resort"
                download="stariva-kp-bazy-otdykha.pdf"
                className="inline-flex items-center justify-center gap-3 bg-terracotta text-parchment px-8 py-4 rounded-full label-caps-md text-[12px] hover:bg-terracotta-dark transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 2v9M4.5 7.5L8 11l3.5-3.5M3 13.5h10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Скачать КП (PDF)
              </a>
              <a
                href="https://t.me/Olga_Stariva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-espresso text-parchment px-8 py-4 rounded-full label-caps-md text-[12px] hover:bg-near-black transition-colors"
              >
                <TelegramIcon className="w-4 h-4" />
                Написать в Telegram
              </a>
            </div>

            <p className="text-mid-grey text-[12px] mt-6">
              Или позвоните:{" "}
              <a
                href="tel:+79778722546"
                className="text-espresso/70 hover:text-espresso transition-colors"
              >
                +7 977 872 25 46
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <Reviews limit={3} heading="Нас выбирают — и возвращаются" />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
              <p className="label-caps text-terracotta text-[10px] mb-4">
                Частые вопросы
              </p>
              <h2
                className="font-serif text-near-black"
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
              >
                Вопросы о работе с базами отдыха
              </h2>
            </div>

            <dl className="divide-y divide-espresso/8">
              {faq.map((item) => (
                <div key={item.q} className="py-6">
                  <dt className="font-serif text-near-black text-[17px] mb-3">
                    {item.q}
                  </dt>
                  <dd className="text-dark-grey text-[14px] leading-relaxed">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Contact strip ────────────────────────────────────────────────── */}
      <section className="py-16 bg-espresso">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-white text-xl mb-1">
              Остались вопросы?
            </p>
            <p className="text-parchment/60 text-[13px]">
              Ответим в течение часа в рабочее время
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://t.me/Olga_Stariva"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 text-white px-5 py-2.5 rounded-full label-caps-md text-[11px] hover:bg-white/20 transition-colors"
            >
              <TelegramIcon className="w-4 h-4" />
              Telegram
            </a>
            <a
              href="tel:+79778722546"
              className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 text-white px-5 py-2.5 rounded-full label-caps-md text-[11px] hover:bg-white/20 transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              Позвонить
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
