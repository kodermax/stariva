# Руководство по артикулам товаров Ozon

## Структура артикулов

Все товары используют единую систему артикулов формата: **КАТЕГОРИЯ-ПОДКАТЕГОРИЯ-НОМЕР**

### Формат
```
XXX-YYY-NNN
```
- `XXX` - код категории (3 буквы)
- `YYY` - код подкатегории (3 буквы)
- `NNN` - порядковый номер (3 цифры с ведущими нулями)

## Категории и префиксы

### 🧥 Одежда (Clothes)
| Подкатегория | Префикс | Описание | Пример |
|--------------|---------|----------|--------|
| Платья | `CLO-DRS` | Платья макраме | CLO-DRS-001 |
| Топы | `CLO-TOP` | Топы макраме | CLO-TOP-001 |
| Пояса | `CLO-BLT` | Пояса макраме | CLO-BLT-001 |

### 🏠 Интерьер (Interior)
| Подкатегория | Префикс | Описание | Пример |
|--------------|---------|----------|--------|
| Абажуры | `INT-LMP` | Абажуры макраме | INT-LMP-001 |
| Типи | `INT-TIP` | Типи для детей | INT-TIP-001 |
| Панно | `INT-PAN` | Панно макраме | INT-PAN-001 |
| Салфетки | `INT-PLM` | Салфетки/подставки | INT-PLM-001 |
| Кашпо | `INT-PLN` | Кашпо для растений | INT-PLN-001 |

### 👜 Сумки (Bags)
| Подкатегория | Префикс | Описание | Пример |
|--------------|---------|----------|--------|
| Шопперы | `BAG-TOT` | Сумки-шопперы | BAG-TOT-001 |
| Через плечо | `BAG-CRS` | Сумки через плечо | BAG-CRS-001 |
| Корзины | `BAG-BSK` | Корзины макраме | BAG-BSK-001 |

## Примеры товаров

### Одежда
```typescript
"CLO-DRS-001": "Платье макраме бохо белое"
"CLO-DRS-002": "Платье макраме бохо бежевое"
"CLO-TOP-001": "Топ макраме летний белый"
"CLO-BLT-001": "Пояс макраме с бахромой"
```

### Интерьер
```typescript
"INT-LMP-001": "Абажур макраме купол большой"
"INT-LMP-002": "Абажур макраме цилиндр средний"
"INT-TIP-001": "Типи детское с макраме декором"
"INT-PAN-001": "Панно макраме настенное большое"
"INT-PAN-002": "Панно макраме круглое"
"INT-PLM-001": "Набор салфеток макраме (4 шт)"
"INT-PLN-001": "Кашпо макраме подвесное"
```

### Сумки
```typescript
"BAG-TOT-001": "Сумка-шоппер макраме большая"
"BAG-CRS-001": "Сумка через плечо макраме"
"BAG-BSK-001": "Корзина макраме для хранения"
```

## Использование в коде

### 1. Генерация нового артикула

```typescript
import { generateArticle } from '@/data/ozon-article-template';

// Создать артикул для нового платья
const article = generateArticle('clothes', 'dresses', 3);
// Результат: "CLO-DRS-003"
```

### 2. Парсинг артикула

```typescript
import { parseArticle } from '@/data/ozon-article-template';

const parsed = parseArticle('INT-LMP-001');
// Результат: { category: 'interior', subcategory: 'lampshades', number: 1 }
```

### 3. Получение следующего доступного артикула

```typescript
import { getNextArticle } from '@/data/ozon-article-template';

const existingArticles = ['CLO-DRS-001', 'CLO-DRS-002', 'CLO-DRS-005'];
const nextArticle = getNextArticle('clothes', 'dresses', existingArticles);
// Результат: "CLO-DRS-006" (следующий после максимального)
```

### 4. Валидация артикула

```typescript
import { isValidArticle } from '@/data/ozon-article-template';

isValidArticle('CLO-DRS-001'); // true
isValidArticle('INVALID-123'); // false
```

### 5. Получение описания

```typescript
import { getArticleDescription } from '@/data/ozon-article-template';

const description = getArticleDescription('INT-LMP-001');
// Результат: "Абажуры макраме"
```

## Трансформация товаров Ozon

### Автоматическая трансформация

```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';
import type { OzonProductInfo } from '@/lib/ozon-types';

// Получить товары из Ozon API
const ozonProducts: OzonProductInfo[] = await fetchOzonProducts();

// Трансформировать в внутренний формат с автоматической генерацией артикулов
const products = transformOzonProducts(ozonProducts);

// Каждый товар получит артикул на основе категории и названия
```

### Ручной маппинг Ozon offer_id → Артикул

Отредактируйте файл `src/lib/ozon-article-mapper.ts`:

```typescript
export const OZON_TO_ARTICLE_MAP: Record<string, string> = {
  "OZON-12345": "CLO-DRS-001",  // Платье белое
  "OZON-12346": "CLO-DRS-002",  // Платье бежевое
  "OZON-12347": "INT-LMP-001",  // Абажур купол
  // ... добавить остальные товары
};
```

### Определение категории

Система автоматически определяет категорию по:

1. **Ozon category_id** (приоритет)
2. **Названию товара** (ключевые слова)

Ключевые слова для определения:
- **Платья**: "платье", "dress"
- **Топы**: "топ", "top"
- **Абажуры**: "абажур", "lampshade", "светильник"
- **Типи**: "типи", "tipi", "вигвам"
- **Панно**: "панно", "wall panel", "настенн"
- **Кашпо**: "кашпо", "planter", "plant hanger"
- **Шопперы**: "шоппер", "tote"
- **Корзины**: "корзин", "basket"

## Workflow для добавления новых товаров

### Шаг 1: Добавить товар на Ozon
1. Создать товар в личном кабинете Ozon
2. Заполнить описание, добавить фото
3. Указать цену и остатки

### Шаг 2: Получить данные через API
```typescript
// API автоматически получит новые товары
const response = await fetch('/api/ozon/products');
const data = await response.json();
```

### Шаг 3: Трансформировать товары
```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';

const products = transformOzonProducts(data.result.items);
// Новые товары получат артикулы автоматически
```

### Шаг 4: Сохранить маппинг (опционально)
```typescript
import { exportArticleMapping } from '@/lib/ozon-article-mapper';

const mapping = exportArticleMapping(products);
// Сохранить mapping в OZON_TO_ARTICLE_MAP для постоянного использования
```

## Правила нумерации

1. **Последовательная нумерация**: Номера идут по порядку в рамках подкатегории
2. **Ведущие нули**: Всегда 3 цифры (001, 002, ..., 099, 100)
3. **Без пропусков**: Стараться не оставлять пропуски в нумерации
4. **Резервирование**: Можно зарезервировать диапазоны для специальных коллекций

### Примеры резервирования
```
CLO-DRS-001 до CLO-DRS-050 - Летняя коллекция
CLO-DRS-051 до CLO-DRS-100 - Осенняя коллекция
CLO-DRS-101 до CLO-DRS-150 - Зимняя коллекция
```

## Расширение системы

### Добавление новой категории

1. Отредактируйте `src/data/ozon-article-template.ts`
2. Добавьте новую категорию в `ARTICLE_PREFIXES`:

```typescript
export const ARTICLE_PREFIXES: Record<string, ArticlePrefix[]> = {
  // ... существующие категории
  
  // Новая категория
  accessories: [
    {
      category: "accessories",
      subcategory: "earrings",
      prefix: "ACC-EAR",
      description: "Серьги макраме",
    },
    {
      category: "accessories",
      subcategory: "bracelets",
      prefix: "ACC-BRC",
      description: "Браслеты макраме",
    },
  ],
};
```

3. Добавьте примеры в `ARTICLE_EXAMPLES`
4. Обновите типы в `src/lib/ozon-types.ts`

### Добавление новой подкатегории

```typescript
interior: [
  // ... существующие подкатегории
  {
    category: "interior",
    subcategory: "curtains",
    prefix: "INT-CRT",
    description: "Шторы макраме",
  },
],
```

## Файлы системы

- **`src/data/ozon-article-template.ts`** - Шаблоны и утилиты для артикулов
- **`src/lib/ozon-article-mapper.ts`** - Трансформация Ozon → внутренний формат
- **`src/lib/ozon-types.ts`** - TypeScript типы
- **`OZON_ARTICLES_GUIDE.md`** - Это руководство

## Поддержка

При возникновении вопросов или необходимости добавления новых категорий обращайтесь к разработчику.
