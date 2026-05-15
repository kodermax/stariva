# 🎯 НАЧНИ ЗДЕСЬ - Система артикулов Ozon

## 👋 Привет!

Я подготовил для тебя полную систему управления артикулами товаров Ozon. Вот что тебе нужно знать:

## ⚡ Быстрый старт (5 минут)

### Шаг 1: Открой главный файл
📍 **[OZON_ARTICLES_INDEX.md](./OZON_ARTICLES_INDEX.md)** - Навигация по всей системе

### Шаг 2: Выбери свой путь

#### Путь A: Я хочу быстро начать работу
1. Открой [OZON_ARTICLES_README.md](./OZON_ARTICLES_README.md) (6 KB, 10 минут)
2. Открой [OZON_ARTICLES_CHEATSHEET.md](./OZON_ARTICLES_CHEATSHEET.md) (5 KB, 5 минут)
3. Запусти примеры из [src/data/ozon-articles-examples.ts](./src/data/ozon-articles-examples.ts)

#### Путь B: Я хочу понять систему глубоко
1. Открой [OZON_ARTICLES_GUIDE.md](./OZON_ARTICLES_GUIDE.md) (10 KB, 30 минут)
2. Открой [OZON_ARTICLES_SCHEMA.md](./OZON_ARTICLES_SCHEMA.md) (19 KB, 45 минут)
3. Изучи код в [src/data/ozon-article-template.ts](./src/data/ozon-article-template.ts)

#### Путь C: Мне нужна только шпаргалка
1. Открой [OZON_ARTICLES_CHEATSHEET.md](./OZON_ARTICLES_CHEATSHEET.md) (5 KB)
2. Используй команды из шпаргалки
3. Готово!

## 📦 Что создано?

### 📚 Документация (7 файлов, 72 KB)
- **INDEX** - Навигация
- **README** - Быстрый старт
- **CHEATSHEET** - Шпаргалка
- **GUIDE** - Полное руководство
- **SCHEMA** - Визуальная схема
- **SUMMARY** - Итоговое резюме
- **COMPLETE** - Финальный отчет

### 💻 Код (3 файла, 33 KB)
- **ozon-article-template.ts** - Шаблоны и утилиты
- **ozon-article-mapper.ts** - Трансформация Ozon → Product
- **ozon-articles-examples.ts** - 9 готовых примеров

### 🤖 AI Guide (1 файл, 8 KB)
- **ozon-articles-ai-guide.md** - Руководство для AI

## 🎯 Что это дает?

### Формат артикула
```
CLO-DRS-001
│   │   │
│   │   └─── Номер (001-999)
│   └─────── Подкатегория (DRS = dresses)
└─────────── Категория (CLO = clothes)
```

### Все категории (11 подкатегорий)

**🧥 Одежда (CLO)**
- CLO-DRS - Платья
- CLO-TOP - Топы
- CLO-BLT - Пояса

**🏠 Интерьер (INT)**
- INT-LMP - Абажуры
- INT-TIP - Типи
- INT-PAN - Панно
- INT-PLM - Салфетки
- INT-PLN - Кашпо

**👜 Сумки (BAG)**
- BAG-TOT - Шопперы
- BAG-CRS - Через плечо
- BAG-BSK - Корзины

## 💡 Примеры использования

### Создать артикул
```typescript
import { generateArticle } from '@/data/ozon-article-template';
const article = generateArticle('clothes', 'dresses', 1);
// Результат: "CLO-DRS-001"
```

### Трансформировать товары Ozon
```typescript
import { transformOzonProducts } from '@/lib/ozon-article-mapper';

const response = await fetch('/api/ozon/products');
const data = await response.json();
const products = transformOzonProducts(data.result.items);
// Каждый товар получит артикул автоматически!
```

### Получить следующий артикул
```typescript
import { getNextArticle } from '@/data/ozon-article-template';

const existing = ['CLO-DRS-001', 'CLO-DRS-002'];
const next = getNextArticle('clothes', 'dresses', existing);
// Результат: "CLO-DRS-003"
```

## 🚀 Основные возможности

✅ **Автоматизация**
- Автоопределение категории по названию
- Автогенерация артикулов
- Извлечение данных из описаний

✅ **Утилиты (10+ функций)**
- generateArticle()
- getNextArticle()
- parseArticle()
- isValidArticle()
- transformOzonProducts()
- и другие...

✅ **Данные**
- 14 примеров артикулов
- 9 примеров кода
- Полная типизация TypeScript

## 📖 Структура документации

```
START_HERE_OZON_ARTICLES.md  ← ТЫ ЗДЕСЬ
    ↓
OZON_ARTICLES_INDEX.md       ← Навигация
    ↓
┌───────────────┬──────────────┬────────────────┐
│               │              │                │
README.md   CHEATSHEET.md  GUIDE.md      SCHEMA.md
(Старт)     (Шпаргалка)    (Полное)     (Схемы)
                                │
                                ↓
                          SUMMARY.md
                          (Резюме)
```

## 🎨 Примеры артикулов

```
CLO-DRS-001  →  Платье макраме бохо белое
INT-LMP-001  →  Абажур макраме купол большой
BAG-TOT-001  →  Сумка-шоппер макраме большая
```

## 🔄 Как это работает?

```
1. Товар на Ozon
   ↓
2. API возвращает данные
   ↓
3. transformOzonProducts()
   ↓
4. Система автоматически:
   • Определяет категорию
   • Генерирует артикул
   • Извлекает данные
   ↓
5. Product готов!
```

## ✅ Что делать дальше?

### Вариант 1: Быстро начать (15 минут)
1. ✅ Открой [OZON_ARTICLES_INDEX.md](./OZON_ARTICLES_INDEX.md)
2. ✅ Прочитай [OZON_ARTICLES_README.md](./OZON_ARTICLES_README.md)
3. ✅ Запусти примеры

### Вариант 2: Глубоко изучить (1 час)
1. ✅ Открой [OZON_ARTICLES_INDEX.md](./OZON_ARTICLES_INDEX.md)
2. ✅ Прочитай [OZON_ARTICLES_GUIDE.md](./OZON_ARTICLES_GUIDE.md)
3. ✅ Изучи [OZON_ARTICLES_SCHEMA.md](./OZON_ARTICLES_SCHEMA.md)
4. ✅ Посмотри код

### Вариант 3: Сразу использовать (5 минут)
1. ✅ Открой [OZON_ARTICLES_CHEATSHEET.md](./OZON_ARTICLES_CHEATSHEET.md)
2. ✅ Скопируй команду
3. ✅ Используй!

## 📊 Статистика

- **Файлов:** 11 (10 новых + 1 обновлен)
- **Размер:** ~105 KB
- **Категорий:** 3
- **Подкатегорий:** 11
- **Функций:** 10+
- **Примеров:** 14 артикулов + 9 примеров кода

## 🎯 Главные файлы

| Файл | Для чего | Время |
|------|----------|-------|
| [INDEX](./OZON_ARTICLES_INDEX.md) | Навигация | 5 мин |
| [README](./OZON_ARTICLES_README.md) | Быстрый старт | 10 мин |
| [CHEATSHEET](./OZON_ARTICLES_CHEATSHEET.md) | Шпаргалка | 5 мин |
| [GUIDE](./OZON_ARTICLES_GUIDE.md) | Полное руководство | 30 мин |
| [SCHEMA](./OZON_ARTICLES_SCHEMA.md) | Визуальная схема | 45 мин |

## 🆘 Нужна помощь?

### Я не знаю с чего начать
→ Открой [OZON_ARTICLES_INDEX.md](./OZON_ARTICLES_INDEX.md)

### Мне нужна быстрая команда
→ Открой [OZON_ARTICLES_CHEATSHEET.md](./OZON_ARTICLES_CHEATSHEET.md)

### Я хочу понять как это работает
→ Открой [OZON_ARTICLES_SCHEMA.md](./OZON_ARTICLES_SCHEMA.md)

### Мне нужны примеры кода
→ Открой [src/data/ozon-articles-examples.ts](./src/data/ozon-articles-examples.ts)

### Я работаю с AI
→ AI уже знает о системе через [.kiro/steering/ozon-articles-ai-guide.md](./.kiro/steering/ozon-articles-ai-guide.md)

## 🎉 Готово!

Система полностью готова к использованию. Выбери свой путь и начни работу!

---

## 🚀 СЛЕДУЮЩИЙ ШАГ

### Открой главный файл навигации:
# 📍 [OZON_ARTICLES_INDEX.md](./OZON_ARTICLES_INDEX.md)

---

**Дата:** 15 мая 2026  
**Версия:** 1.0.0  
**Проект:** Stariva - Макраме ручной работы
