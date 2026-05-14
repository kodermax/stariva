import type { Product, Category } from "./ozon-types"

export const categories: Category[] = [
  {
    slug: "clothes",
    name: "Одежда",
    description: "Уникальные платья и топы из натурального хлопка, созданные вручную в технике макраме",
    image: "/images/catalog/category-clothes.jpg",
    subcategories: [
      { slug: "dresses", name: "Платья", categorySlug: "clothes" },
      { slug: "tops", name: "Топы", categorySlug: "clothes" },
    ],
  },
  {
    slug: "interior",
    name: "Интерьер",
    description: "Абажуры и вигвамы, которые создают особую атмосферу уюта в вашем доме",
    image: "/images/catalog/category-interior.jpg",
    subcategories: [
      { slug: "lampshades", name: "Абажуры", categorySlug: "interior" },
      { slug: "tipis", name: "Вигвамы", categorySlug: "interior" },
    ],
  },
  {
    slug: "decor",
    name: "Декор",
    description: "Панно, плейсменты и кашпо для создания завершённого образа вашего пространства",
    image: "/images/catalog/category-decor.jpg",
    subcategories: [
      { slug: "pannos", name: "Панно", categorySlug: "decor" },
      { slug: "placemats", name: "Плейсменты", categorySlug: "decor" },
      { slug: "planters", name: "Кашпо", categorySlug: "decor" },
    ],
  },
]

export const products: Product[] = [
  // CLOTHES - Dresses
  {
    id: "dress-boho-001",
    slug: "platie-boho-naturalnyy-khlopok",
    name: "Платье «Богема»",
    description: `Воздушное платье в стиле бохо, полностью выполненное вручную в технике макраме из 100% натурального хлопка.

Идеально подходит для пляжного отдыха, фотосессий или особых летних мероприятий. Ажурное плетение создаёт красивую игру света и тени, подчёркивая естественную красоту.

Платье имеет свободный крой, который подходит для разных типов фигуры. Длина до середины икры, есть небольшой разрез по бокам для удобства движения.`,
    shortDescription: "Воздушное платье в стиле бохо из 100% натурального хлопка",
    price: 18500,
    oldPrice: 22000,
    currency: "RUB",
    images: ["/images/catalog/dress-boho-1.jpg"],
    category: "clothes",
    subcategory: "dresses",
    inStock: true,
    material: "100% хлопок",
    dimensions: "Размеры: S, M, L",
    careInstructions: "Ручная стирка при 30°C",
    featured: true,
    ozonUrl: "https://ozon.ru/product/123456",
  },
  {
    id: "dress-beach-002",
    slug: "platie-plyazhnoe-azhurnoe",
    name: "Платье «Морской бриз»",
    description: `Элегантное пляжное платье с открытой спиной, созданное в технике макраме.

Нежное ажурное плетение создаёт эффект лёгкости и воздушности. Платье прекрасно сочетается с купальником или лёгким бельём.

Универсальный размер благодаря завязкам на шее и талии. Идеально для пляжного отдыха, вечеринок у бассейна или фотосессий на закате.`,
    shortDescription: "Элегантное пляжное платье с открытой спиной",
    price: 15900,
    currency: "RUB",
    images: ["/images/catalog/dress-boho-2.jpg"],
    category: "clothes",
    subcategory: "dresses",
    inStock: true,
    material: "100% хлопок",
    dimensions: "Универсальный размер",
    careInstructions: "Ручная стирка при 30°C",
    ozonUrl: "https://ozon.ru/product/123457",
  },
  // CLOTHES - Tops
  {
    id: "top-crop-001",
    slug: "top-makrame-geometriya",
    name: "Топ «Геометрия»",
    description: `Стильный кроп-топ с геометрическим узором, выполненный вручную в технике макраме.

Уникальное плетение создаёт изысканный рисунок, который подчёркивает красоту плеч и зоны декольте. Идеален для пляжа, фестивалей или летних вечеринок.

Мягкий натуральный хлопок приятен к телу и позволяет коже дышать. Завязки сзади позволяют регулировать посадку.`,
    shortDescription: "Стильный кроп-топ с геометрическим узором",
    price: 8900,
    currency: "RUB",
    images: ["/images/catalog/top-macrame.jpg"],
    category: "clothes",
    subcategory: "tops",
    inStock: true,
    material: "100% хлопок",
    dimensions: "Размеры: XS, S, M",
    careInstructions: "Ручная стирка при 30°C",
    ozonUrl: "https://ozon.ru/product/123458",
  },
  // INTERIOR - Lampshades
  {
    id: "lamp-dome-001",
    slug: "abazhur-kupol-bolshoy",
    name: "Абажур «Купол»",
    description: `Большой куполообразный абажур из натурального хлопка, создающий мягкое рассеянное освещение.

Спиральное плетение создаёт красивую игру света и тени на стенах и потолке. Идеален для гостиной, спальни или над обеденным столом.

Диаметр 45 см позволяет использовать абажур как центральный элемент освещения. Подходит для стандартных патронов E27.

В комплект входит: абажур, крепление для патрона, инструкция по установке.`,
    shortDescription: "Куполообразный абажур с красивой игрой света",
    price: 12500,
    oldPrice: 15000,
    currency: "RUB",
    images: ["/images/catalog/lampshade-dome.jpg"],
    category: "interior",
    subcategory: "lampshades",
    inStock: true,
    material: "100% хлопок, металлический каркас",
    dimensions: "Диаметр: 45 см, Высота: 35 см",
    careInstructions: "Сухая чистка, протирать от пыли мягкой щёткой",
    featured: true,
    ozonUrl: "https://ozon.ru/product/123459",
  },
  {
    id: "lamp-cylinder-002",
    slug: "abazhur-tsilindr-sredny",
    name: "Абажур «Колонна»",
    description: `Цилиндрический абажур с вертикальным рельефным плетением.

Строгая геометрическая форма в сочетании с мягкостью натурального хлопка создаёт интересный контраст. Подходит для скандинавского, минималистичного или бохо-интерьера.

Компактный размер позволяет использовать его над прикроватной тумбой, в прихожей или на кухне.`,
    shortDescription: "Цилиндрический абажур с рельефным плетением",
    price: 8900,
    currency: "RUB",
    images: ["/images/catalog/lampshade-cylinder.jpg"],
    category: "interior",
    subcategory: "lampshades",
    inStock: true,
    material: "100% хлопок, металлический каркас",
    dimensions: "Диаметр: 25 см, Высота: 30 см",
    careInstructions: "Сухая чистка, протирать от пыли мягкой щёткой",
    ozonUrl: "https://ozon.ru/product/123460",
  },
  // INTERIOR - Tipis
  {
    id: "tipi-kids-001",
    slug: "vigvam-detsky-makrame",
    name: "Вигвам «Уютное гнёздышко»",
    description: `Детский вигвам с макраме-декором — идеальное место для игр и отдыха вашего ребёнка.

Каркас из натурального дерева (сосна) обеспечивает устойчивость и безопасность. Полог украшен ручным макраме-плетением, создающим атмосферу волшебства.

Вигвам легко собирается и разбирается, что удобно для хранения. Внутри достаточно места для подушек, игрушек и даже небольшого столика.

Высота позволяет ребёнку стоять внутри до 5-6 лет.`,
    shortDescription: "Детский вигвам с макраме-декором для игр и отдыха",
    price: 28900,
    currency: "RUB",
    images: ["/images/catalog/tipi-kids.jpg"],
    category: "interior",
    subcategory: "tipis",
    inStock: true,
    material: "Каркас: сосна, Полог: 100% хлопок",
    dimensions: "Высота: 150 см, Основание: 110×110 см",
    careInstructions: "Полог: ручная стирка. Каркас: протирать влажной тканью",
    featured: true,
    ozonUrl: "https://ozon.ru/product/123461",
  },
  // DECOR - Pannos
  {
    id: "panno-mountain-001",
    slug: "panno-gory-bolshoe",
    name: "Панно «Горизонт»",
    description: `Большое настенное панно с геометрическим рисунком гор и длинной бахромой.

Это панно станет центральным элементом декора вашей гостиной, спальни или прихожей. Сложное плетение создаёт объёмный рельеф, который играет при разном освещении.

Панно крепится на деревянный держатель из натурального бука. В комплекте — шнур для подвешивания и крепёж.`,
    shortDescription: "Большое настенное панно с геометрическим узором",
    price: 14500,
    currency: "RUB",
    images: ["/images/catalog/panno-large.jpg"],
    category: "decor",
    subcategory: "pannos",
    inStock: true,
    material: "100% хлопок, держатель из бука",
    dimensions: "Ширина: 80 см, Высота с бахромой: 120 см",
    careInstructions: "Сухая чистка, встряхивать от пыли",
    ozonUrl: "https://ozon.ru/product/123462",
  },
  {
    id: "panno-round-002",
    slug: "panno-krugloe-mandala",
    name: "Панно «Мандала»",
    description: `Круглое панно в стиле ловца снов с элементами макраме, деревянными бусинами и перьями.

Символика мандалы — гармония, целостность и защита. Это панно создаст особую атмосферу в вашей спальне или зоне медитации.

Ручная работа делает каждое изделие уникальным. Натуральные материалы и приглушённые тона вписываются в любой интерьер.`,
    shortDescription: "Круглое панно в стиле ловца снов",
    price: 7900,
    currency: "RUB",
    images: ["/images/catalog/panno-round.jpg"],
    category: "decor",
    subcategory: "pannos",
    inStock: true,
    material: "100% хлопок, деревянные бусины, перья",
    dimensions: "Диаметр: 40 см",
    careInstructions: "Сухая чистка",
    ozonUrl: "https://ozon.ru/product/123463",
  },
  // DECOR - Placemats
  {
    id: "placemat-set-001",
    slug: "pleismenty-nabor-4-sht",
    name: "Плейсменты «Завтрак на траве»",
    description: `Набор из 4 круглых плейсментов ручной работы для сервировки стола.

Плетение выполнено из прочного хлопкового шнура, который легко чистится и долго сохраняет форму. Диаметр идеален для стандартных обеденных тарелок.

Плейсменты защищают поверхность стола от царапин и тепла, создавая при этом уютную атмосферу. Отличный подарок на новоселье или свадьбу.`,
    shortDescription: "Набор из 4 круглых плейсментов для сервировки",
    price: 4900,
    currency: "RUB",
    images: ["/images/catalog/placemat-set.jpg"],
    category: "decor",
    subcategory: "placemats",
    inStock: true,
    material: "100% хлопковый шнур",
    dimensions: "Диаметр: 35 см (каждый)",
    careInstructions: "Ручная стирка при 30°C, сушить в расправленном виде",
    ozonUrl: "https://ozon.ru/product/123464",
  },
  // DECOR - Planters
  {
    id: "planter-001",
    slug: "kashpo-podvesnoe-makrame",
    name: "Кашпо подвесное «Джунгли»",
    description: `Подвесное кашпо для растений в технике макраме.

Идеально подходит для вьющихся растений: потоса, традесканции, плюща. Прочное плетение выдерживает горшки диаметром до 18 см.

Кашпо визуально поднимает растения, освобождая место на подоконниках и полках. Создаёт атмосферу urban jungle в любом помещении.

Длина шнура для подвешивания регулируется.`,
    shortDescription: "Подвесное кашпо для вьющихся растений",
    price: 3200,
    currency: "RUB",
    images: ["/images/catalog/plant-hanger.jpg"],
    category: "decor",
    subcategory: "planters",
    inStock: true,
    material: "100% хлопковый шнур",
    dimensions: "Подходит для горшков Ø 12-18 см, Длина: 90 см",
    careInstructions: "Ручная стирка, избегать прямых солнечных лучей",
    ozonUrl: "https://ozon.ru/product/123465",
  },
]

// Helper functions
export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductsBySubcategory(subcategory: string): Product[] {
  return products.filter((p) => p.subcategory === subcategory)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function formatPrice(price: number, currency: string = "RUB"): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
