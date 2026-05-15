---
inclusion: manual
---

# AI Guide: Работа с артикулами товаров Ozon

Это руководство для AI ассистента по работе с системой артикулов товаров Ozon в проекте Stariva.

## Система артикулов

### Формат: `XXX-YYY-NNN`
- `XXX` - категория (3 буквы)
- `YYY` - подкатегория (3 буквы)  
- `NNN` - номер (3 цифры с нулями)

### Все префиксы

**Одежда (Clothes):**
- `CLO-DRS` - Платья (dresses)
- `CLO-TOP` - Топы (tops)
- `CLO-BLT` - Пояса (belts)

**Интерьер (Interior):**
- `INT-LMP` - Абажуры (lampshades)
- `INT-TIP` - Типи (tipis)
- `INT-PAN` - Панно (pannos)
- `INT-PLM` - Салфетки/подставки (placemats)
- `INT-PLN` - Кашпо (planters)

**Сумки (Bags):**
- `BAG-TOT` - Шопперы (totes)
- `BAG-CRS` - Через плечо (crossbody)
- `BAG-BSK` - Корзины (baskets)

## Основные файлы

1. **`src/data/ozon-article-template.ts`** - Шаблоны, утилиты, примеры
2. **`src/lib/ozon-article-mapper.ts`** - Трансформация Ozon → Product
3. **`src/lib/ozon-types.ts`** - TypeScript типы
4. **`OZON_ARTICLES_GUIDE.md`** - Полная документация
5. **`OZON_ARTICLES_CHEATSHEET.md`** - Быстрая шпаргалка

## Когда использовать

### Создание нового товара
```typescript
import { generateArticle } from '@/data/ozon-article-template';
const article = generateArticle('clothes', 'dresses', 1); // CLO-DRS-001
```

### Получение следующего артикула
```typescript
import { getNextArticle } from '@/data/ozon-article-template';
const next = getNextArticle('interior', 'lampshades', existingArticles);
```

### Трансформация товаров Ozon
```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';
const products = transformOzonProducts(ozonApiData.result.items);
```

### Валидация
```typescript
import { isValidArticle, parseArticle } from '@/data/ozon-article-template';
if (isValidArticle('CLO-DRS-001')) {
  const info = parseArticle('CLO-DRS-001');
}
```

## Автоопределение категории

Система автоматически определяет категорию по ключевым словам в названии:

- **Платья**: "платье", "dress"
- **Топы**: "топ", "top"
- **Абажуры**: "абажур", "lampshade", "светильник"
- **Типи**: "типи", "tipi", "вигвам"
- **Панно**: "панно", "wall panel", "настенн"
- **Кашпо**: "кашпо", "planter", "plant hanger"
- **Шопперы**: "шоппер", "tote"
- **Корзины**: "корзин", "basket"

## Workflow трансформации

1. Получить товары из Ozon API (`/api/ozon/products`)
2. Вызвать `transformOzonProducts(ozonProducts)`
3. Система автоматически:
   - Определит категорию по названию
   - Сгенерирует артикул (или использует существующий из маппинга)
   - Извлечет данные из описания (материал, размеры, цвет)
   - Создаст объект Product

## Маппинг Ozon ↔ Артикул

Редактировать в `src/lib/ozon-article-mapper.ts`:

```typescript
export const OZON_TO_ARTICLE_MAP: Record<string, string> = {
  "OZON-12345": "CLO-DRS-001",
  "OZON-12346": "INT-LMP-001",
  // ... добавить новые
};
```

## Добавление новой категории

1. Добавить в `ARTICLE_PREFIXES` в `ozon-article-template.ts`
2. Добавить примеры в `ARTICLE_EXAMPLES`
3. Обновить типы в `ozon-types.ts`
4. Добавить ключевые слова в `detectCategoryFromName()` в `ozon-article-mapper.ts`

## Примеры для AI

### Пользователь: "Создай артикул для нового платья"
```typescript
import { getNextArticle } from '@/data/ozon-article-template';
const existingDresses = ['CLO-DRS-001', 'CLO-DRS-002'];
const newArticle = getNextArticle('clothes', 'dresses', existingDresses);
// Результат: CLO-DRS-003
```

### Пользователь: "Трансформируй товары с Ozon"
```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';

// Получить данные из API
const response = await fetch('/api/ozon/products');
const data = await response.json();

// Трансформировать
const products = transformOzonProducts(data.result.items);

// Каждый товар получит артикул автоматически
console.log(products.map(p => `${p.id}: ${p.name}`));
```

### Пользователь: "Добавь новую подкатегорию 'шторы'"
```typescript
// В ozon-article-template.ts добавить:
interior: [
  // ... существующие
  {
    category: "interior",
    subcategory: "curtains",
    prefix: "INT-CRT",
    description: "Шторы макраме",
  },
],

// В ozon-types.ts добавить в ProductSubcategory:
export type ProductSubcategory =
  | "dresses"
  | "tops"
  // ...
  | "curtains"; // новая

// В ozon-article-mapper.ts добавить в detectCategoryFromName():
if (lowerName.includes("штор") || lowerName.includes("curtain")) {
  return { category: "interior", subcategory: "curtains" };
}
```

## Важные правила

1. **Всегда используй существующие утилиты** - не создавай артикулы вручную
2. **Проверяй валидность** - используй `isValidArticle()` перед сохранением
3. **Используй `getNextArticle()`** - для автоматической нумерации
4. **Сохраняй маппинг** - обновляй `OZON_TO_ARTICLE_MAP` для постоянных связей
5. **Следуй формату** - всегда 3 буквы + 3 буквы + 3 цифры

## Типичные ошибки

❌ **Неправильно:**
```typescript
const article = "CLO-DRS-1"; // Не 3 цифры
const article = "CLOTHES-DRESS-001"; // Слишком длинные коды
const article = "clo-drs-001"; // Строчные буквы
```

✅ **Правильно:**
```typescript
const article = generateArticle('clothes', 'dresses', 1); // CLO-DRS-001
const article = getNextArticle('clothes', 'dresses', existing);
```

## Быстрая справка

| Задача | Функция |
|--------|---------|
| Создать артикул | `generateArticle(category, subcategory, number)` |
| Следующий артикул | `getNextArticle(category, subcategory, existing)` |
| Парсить артикул | `parseArticle(article)` |
| Проверить валидность | `isValidArticle(article)` |
| Получить описание | `getArticleDescription(article)` |
| Трансформировать Ozon | `transformOzonProducts(ozonProducts)` |
| Определить категорию | `detectCategoryFromName(name)` |

## Контекст проекта

Проект Stariva - интернет-магазин изделий макраме ручной работы. Товары продаются на Ozon, и система артикулов помогает:
- Унифицировать идентификацию товаров
- Связать товары Ozon с внутренней базой
- Упростить управление каталогом
- Автоматизировать трансформацию данных

При работе с товарами всегда используй эту систему артикулов для консистентности.
