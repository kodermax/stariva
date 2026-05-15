# Система артикулов товаров Ozon - Быстрый старт

## 🎯 Что это?

Система для управления артикулами товаров Ozon с автоматической трансформацией в внутренний формат.

**Формат артикула:** `CLO-DRS-001` (Категория-Подкатегория-Номер)

## 📚 Документация

- **[OZON_ARTICLES_GUIDE.md](./OZON_ARTICLES_GUIDE.md)** - Полное руководство
- **[OZON_ARTICLES_CHEATSHEET.md](./OZON_ARTICLES_CHEATSHEET.md)** - Быстрая шпаргалка
- **[.kiro/steering/ozon-articles-ai-guide.md](./.kiro/steering/ozon-articles-ai-guide.md)** - Руководство для AI

## 🚀 Быстрый старт

### 1. Создать новый артикул

```typescript
import { generateArticle } from '@/data/ozon-article-template';

const article = generateArticle('clothes', 'dresses', 1);
console.log(article); // CLO-DRS-001
```

### 2. Получить следующий доступный артикул

```typescript
import { getNextArticle } from '@/data/ozon-article-template';

const existing = ['CLO-DRS-001', 'CLO-DRS-002'];
const next = getNextArticle('clothes', 'dresses', existing);
console.log(next); // CLO-DRS-003
```

### 3. Трансформировать товары Ozon

```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';

// Получить товары из API
const response = await fetch('/api/ozon/products');
const data = await response.json();

// Трансформировать с автоматической генерацией артикулов
const products = transformOzonProducts(data.result.items);
```

## 📋 Все префиксы

### Одежда
- `CLO-DRS` - Платья
- `CLO-TOP` - Топы
- `CLO-BLT` - Пояса

### Интерьер
- `INT-LMP` - Абажуры
- `INT-TIP` - Типи
- `INT-PAN` - Панно
- `INT-PLM` - Салфетки
- `INT-PLN` - Кашпо

### Сумки
- `BAG-TOT` - Шопперы
- `BAG-CRS` - Через плечо
- `BAG-BSK` - Корзины

## 📁 Структура файлов

```
src/
├── data/
│   ├── ozon-article-template.ts      # Шаблоны и утилиты
│   └── ozon-articles-examples.ts     # Примеры использования
├── lib/
│   ├── ozon-article-mapper.ts        # Трансформация Ozon → Product
│   └── ozon-types.ts                 # TypeScript типы
.kiro/steering/
└── ozon-articles-ai-guide.md         # Руководство для AI
OZON_ARTICLES_GUIDE.md                # Полное руководство
OZON_ARTICLES_CHEATSHEET.md           # Шпаргалка
OZON_ARTICLES_README.md               # Этот файл
```

## 🔧 Основные функции

| Функция | Описание |
|---------|----------|
| `generateArticle()` | Создать артикул |
| `getNextArticle()` | Следующий доступный артикул |
| `parseArticle()` | Распарсить артикул |
| `isValidArticle()` | Проверить валидность |
| `transformOzonProducts()` | Трансформировать товары Ozon |
| `detectCategoryFromName()` | Определить категорию по названию |

## 💡 Примеры

### Проверить артикул

```typescript
import { isValidArticle, parseArticle } from '@/data/ozon-article-template';

if (isValidArticle('CLO-DRS-001')) {
  const info = parseArticle('CLO-DRS-001');
  console.log(info);
  // { category: 'clothes', subcategory: 'dresses', number: 1 }
}
```

### Определить категорию по названию

```typescript
import { detectCategoryFromName } from '@/lib/ozon-article-mapper';

const category = detectCategoryFromName('Платье макраме бохо белое');
console.log(category);
// { category: 'clothes', subcategory: 'dresses' }
```

### Запустить все примеры

```typescript
import { runAllExamples } from '@/data/ozon-articles-examples';

runAllExamples(); // Выведет все примеры в консоль
```

## 🎨 Примеры артикулов

```
CLO-DRS-001  →  Платье макраме бохо белое
INT-LMP-001  →  Абажур макраме купол большой
BAG-TOT-001  →  Сумка-шоппер макраме большая
```

## 🔄 Workflow

1. **Товар добавляется на Ozon** → Появляется в API
2. **Система определяет категорию** → По названию или category_id
3. **Генерируется артикул** → Автоматически или из маппинга
4. **Создается Product** → Готов к использованию в каталоге

## ⚙️ Настройка маппинга

Для постоянной связи Ozon offer_id ↔ Артикул редактируйте:

**`src/lib/ozon-article-mapper.ts`**
```typescript
export const OZON_TO_ARTICLE_MAP: Record<string, string> = {
  "OZON-12345": "CLO-DRS-001",
  "OZON-12346": "INT-LMP-001",
  // Добавить новые маппинги
};
```

## 📖 Дополнительно

- Все артикулы валидируются автоматически
- Система предотвращает дубликаты
- Поддержка автоопределения категорий
- Извлечение данных из описаний Ozon
- Полная типизация TypeScript

## 🆘 Помощь

Для подробной информации смотрите:
- [Полное руководство](./OZON_ARTICLES_GUIDE.md)
- [Шпаргалку](./OZON_ARTICLES_CHEATSHEET.md)
- [Примеры кода](./src/data/ozon-articles-examples.ts)
