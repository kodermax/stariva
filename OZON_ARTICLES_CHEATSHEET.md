# Шпаргалка по артикулам Ozon

## 📋 Быстрый справочник префиксов

### Одежда (CLO)
```
CLO-DRS-XXX  →  Платья
CLO-TOP-XXX  →  Топы
CLO-BLT-XXX  →  Пояса
```

### Интерьер (INT)
```
INT-LMP-XXX  →  Абажуры
INT-TIP-XXX  →  Типи
INT-PAN-XXX  →  Панно
INT-PLM-XXX  →  Салфетки/подставки
INT-PLN-XXX  →  Кашпо
```

### Сумки (BAG)
```
BAG-TOT-XXX  →  Шопперы
BAG-CRS-XXX  →  Через плечо
BAG-BSK-XXX  →  Корзины
```

## 🚀 Быстрые команды

### Создать новый артикул
```typescript
import { generateArticle } from '@/data/ozon-article-template';

generateArticle('clothes', 'dresses', 1);  // CLO-DRS-001
generateArticle('interior', 'lampshades', 5);  // INT-LMP-005
generateArticle('bags', 'totes', 10);  // BAG-TOT-010
```

### Получить следующий доступный
```typescript
import { getNextArticle } from '@/data/ozon-article-template';

const existing = ['CLO-DRS-001', 'CLO-DRS-002'];
getNextArticle('clothes', 'dresses', existing);  // CLO-DRS-003
```

### Проверить артикул
```typescript
import { isValidArticle, parseArticle } from '@/data/ozon-article-template';

isValidArticle('CLO-DRS-001');  // true
parseArticle('INT-LMP-005');  // { category: 'interior', subcategory: 'lampshades', number: 5 }
```

### Трансформировать товары Ozon
```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';

const ozonProducts = await fetchOzonProducts();
const products = transformOzonProducts(ozonProducts);
```

## 🔍 Ключевые слова для автоопределения

| Категория | Ключевые слова |
|-----------|----------------|
| Платья | платье, dress |
| Топы | топ, top |
| Пояса | пояс, belt |
| Абажуры | абажур, lampshade, светильник |
| Типи | типи, tipi, вигвам |
| Панно | панно, wall panel, настенн |
| Салфетки | салфетк, placemat, подставк |
| Кашпо | кашпо, planter, plant hanger |
| Шопперы | шоппер, tote |
| Через плечо | через плечо, crossbody, кросс-боди |
| Корзины | корзин, basket |

## 📁 Файлы системы

```
src/
├── data/
│   ├── ozon-article-template.ts      ← Шаблоны и утилиты
│   └── ozon-articles-examples.ts     ← Примеры использования
├── lib/
│   ├── ozon-article-mapper.ts        ← Трансформация Ozon → Product
│   └── ozon-types.ts                 ← TypeScript типы
OZON_ARTICLES_GUIDE.md                ← Полное руководство
OZON_ARTICLES_CHEATSHEET.md           ← Эта шпаргалка
```

## 💡 Типичные задачи

### Добавить новый товар с Ozon
1. Товар появляется в Ozon API
2. Система автоматически определяет категорию
3. Генерируется артикул
4. Товар готов к использованию

### Добавить маппинг вручную
Отредактировать `src/lib/ozon-article-mapper.ts`:
```typescript
export const OZON_TO_ARTICLE_MAP: Record<string, string> = {
  "OZON-12345": "CLO-DRS-001",
  "OZON-12346": "INT-LMP-001",
};
```

### Добавить новую подкатегорию
Отредактировать `src/data/ozon-article-template.ts`:
```typescript
interior: [
  // ... существующие
  {
    category: "interior",
    subcategory: "curtains",
    prefix: "INT-CRT",
    description: "Шторы макраме",
  },
],
```

## 🎯 Примеры артикулов

```
CLO-DRS-001  →  Платье макраме бохо белое
CLO-DRS-002  →  Платье макраме бохо бежевое
CLO-TOP-001  →  Топ макраме летний белый
CLO-BLT-001  →  Пояс макраме с бахромой

INT-LMP-001  →  Абажур макраме купол большой
INT-LMP-002  →  Абажур макраме цилиндр средний
INT-TIP-001  →  Типи детское с макраме декором
INT-PAN-001  →  Панно макраме настенное большое
INT-PAN-002  →  Панно макраме круглое
INT-PLM-001  →  Набор салфеток макраме (4 шт)
INT-PLN-001  →  Кашпо макраме подвесное

BAG-TOT-001  →  Сумка-шоппер макраме большая
BAG-CRS-001  →  Сумка через плечо макраме
BAG-BSK-001  →  Корзина макраме для хранения
```

## ⚡ Тестирование в консоли

```typescript
// В консоли браузера
window.ozonArticleExamples.runAllExamples();

// Или отдельные примеры
window.ozonArticleExamples.example1_generateArticles();
window.ozonArticleExamples.example6_transformOzonProduct();
```
