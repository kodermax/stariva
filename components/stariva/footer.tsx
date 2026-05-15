import {
  VkIcon,
  PinterestIcon,
  LivemasterIcon,
  DzenIcon,
  PhoneIcon,
} from "./icons";

const catalog = [
  "Абажуры из макраме",
  "Платья макраме",
  "Декор для дома",
  "Подарочные сертификаты",
];

const info = ["Уход за изделиями", "О бренде", "Контакты"];

export function Footer() {
  return (
    <footer className="bg-espresso text-parchment">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="font-serif text-5xl lg:text-6xl tracking-tight mb-3">
              Stariva
            </div>
            <div className="label-caps text-parchment/60 mb-8">
              Ручное плетение с 2018
            </div>

            <a
              href="tel:+79778722546"
              className="flex items-center gap-3 text-2xl font-serif text-parchment hover:text-linen transition-colors"
            >
              <PhoneIcon className="w-5 h-5 text-linen" />
              +7 977 872 25 46
            </a>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://vk.com/stariva"
                aria-label="ВКонтакте"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-parchment/20 hover:border-linen hover:text-linen transition-colors"
              >
                <VkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div className="lg:col-span-2 lg:col-start-6">
            <div className="label-caps text-parchment/50 mb-5">Каталог</div>
            <ul className="space-y-3">
              {catalog.map((c) => (
                <li key={c}>
                  <a
                    href="#"
                    className="text-parchment/85 hover:text-linen transition-colors"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="lg:col-span-3">
            <div className="label-caps text-parchment/50 mb-5">Информация</div>
            <ul className="space-y-3">
              {info.map((c) => (
                <li key={c}>
                  <a
                    href="#"
                    className="text-parchment/85 hover:text-linen transition-colors"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="lg:col-span-3">
            <div className="label-caps text-parchment/50 mb-5">
              Мы в соцсетях
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://vk.com/stariva"
                  className="inline-flex items-center gap-2 text-parchment/85 hover:text-linen transition-colors"
                >
                  <VkIcon className="w-4 h-4" />
                  ВКонтакте
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-parchment/85 hover:text-linen transition-colors"
                >
                  <PinterestIcon className="w-4 h-4" />
                  Pinterest
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-parchment/85 hover:text-linen transition-colors"
                >
                  <LivemasterIcon className="w-4 h-4" />
                  Ярмарка Мастеров
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-parchment/85 hover:text-linen transition-colors"
                >
                  <DzenIcon className="w-4 h-4" />
                  Яндекс.Дзен
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-16 pt-8 border-t border-parchment/15">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 text-[11px] leading-relaxed text-parchment/55">
            <div>СЗ Капычева О. А. ИНН: 502480197143</div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a
                href="/privacy-policy"
                className="hover:text-linen transition-colors"
              >
                Политика конфиденциальности
              </a>
              <a href="/offer" className="hover:text-linen transition-colors">
                Договор оферты
              </a>
              <a
                href="/personal-data-consent"
                className="hover:text-linen transition-colors"
              >
                Согласие на обработку персональных данных
              </a>
            </div>
          </div>
          <div className="mt-4 text-[11px] text-parchment/40">
            © Stariva, 2018–2026. Все права защищены. Каждое изделие уникально.
          </div>
        </div>
      </div>
    </footer>
  );
}
