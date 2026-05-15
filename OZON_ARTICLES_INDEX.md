# 📚 Система артикулов Ozon - Навигация

Добро пожаловать в систему управления артикулами товаров Ozon для проекта Stariva!

## 🎯 Быстрый старт

**Новичок?** Начни здесь:
1. 📖 [README - Быстрый старт](./OZON_ARTICLES_README.md) - 5 минут
2. 📋 [Шпаргалка](./OZON_ARTICLES_CHEATSHEET.md) - Справочник команд
3. 💻 [Примеры кода](./src/data/ozon-articles-examples.ts) - Готовые примеры

**Опытный разработчик?** Сразу к делу:
- 🔧 [Код шаблонов](./src/data/ozon-article-template.ts)
- 🔄 [Код маппера](./src/lib/ozon-article-mapper.ts)
- 📘 [Полное руководство](./OZON_ARTICLES_GUIDE.md)

## 📂 Структура документации

### 🚀 Для начала работы

#### [OZON_ARTICLES_README.md](./OZON_ARTICLES_README.md) (6.1 KB)
**Быстрый старт за 5 минут**
- Что это и зачем
- Основные команды
- Примеры использования
- Структура файлов

**Читать когда:** Первое знакомство с системой

---

#### [OZON_ARTICLES_CHEATSHEET.md](./OZON_ARTICLES_CHEATSHEET.md) (5.4 KB)
**Шпаргалка для ежедневной работы**
- Все префиксы в таблице
- Быстрые команды
- Ключевые слова
- Типичные задачи

**Читать когда:** Нужно быстро вспомнить команду или префикс

---

### 📖 Подробная документация

#### [OZON_ARTICLES_GUIDE.md](./OZON_ARTICLES_GUIDE.md) (10.2 KB)
**Полное руководство по системе**
- Структура артикулов
- Все категории и префиксы
- Примеры товаров
- Использование в коде
- Трансформация товаров Ozon
- Workflow добавления товаров
- Правила нумерации
- Расширение системы

**Читать когда:** Нужно глубокое понимание или настройка системы

---

#### [OZON_ARTICLES_SCHEMA.md](./OZON_ARTICLES_SCHEMA.md) (18.9 KB)
**Визуальная схема архитектуры**
- Архитектура системы
- Диаграммы процессов
- Иерархия категорий
- Процесс трансформации
- Маппинг категорий
- Примеры трансформации
- Визуальная карта артикулов

**Читать когда:** Нужно понять как работает система изнутри

---

#### [OZON_ARTICLES_SUMMARY.md](./OZON_ARTICLES_SUMMARY.md) (9.6 KB)
**Итоговое резюме проекта**
- Что создано
- Все файлы и их размеры
- Основные возможности
- Статистика
- Следующие шаги

**Читать когда:** Нужен обзор всей системы

---

### 🤖 Для AI ассистента

#### [.kiro/steering/ozon-articles-ai-guide.md](./.kiro/steering/ozon-articles-ai-guide.md)
**Руководство для AI по работе с артикулами**
- Все префиксы
- Основные функции
- Workflow трансформации
- Примеры для AI
- Типичные ошибки
- Быстрая справка

**Использовать когда:** AI помогает с артикулами

---

## 💻 Код и примеры

### Основные файлы

#### [src/data/ozon-article-template.ts](./src/data/ozon-article-template.ts) (9.3 KB)
**Шаблоны и утилиты артикулов**
```typescript
// Основные функции:
generateArticle(category, subcategory, number)
getNextArticle(category, subcategory, existing)
parseArticle(article)
isValidArticle(article)
getArticleDescription(article)
```

---

#### [src/lib/ozon-article-mapper.ts](./src/lib/ozon-article-mapper.ts) (9.8 KB)
**Трансформация Ozon → Product**
```typescript
// Основные функции:
transformOzonProducts(ozonProducts)
transformOzonToProduct(ozonProduct, existing)
detectCategoryFromName(name)
detectCategoryFromOzonId(categoryId)
```

---

#### [src/data/ozon-articles-examples.ts](./src/data/ozon-articles-examples.ts) (14.3 KB)
**9 готовых примеров использования**
```typescript
// Запустить все примеры:
import { runAllExamples } from '@/data/ozon-articles-examples';
runAllExamples();

// Или отдельные примеры:
example1_generateArticles()
example2_parseArticles()
example3_getNextArticle()
// ... и другие
```

---

#### [src/lib/ozon-types.ts](./src/lib/ozon-types.ts) (обновлен)
**TypeScript типы**
```typescript
// Добавлены типы:
ArticleCode
ArticleInfo
ArticleMapping
```

---

## 🎯 Навигация по задачам

### Я хочу...

#### ...начать работу с системой
→ [README](./OZON_ARTICLES_README.md) → [Примеры кода](./src/data/ozon-articles-examples.ts)

#### ...создать новый артикул
→ [Шпаргалка](./OZON_ARTICLES_CHEATSHEET.md) → Раздел "Создать новый артикул"

#### ...трансформировать товары Ozon
→ [Руководство](./OZON_ARTICLES_GUIDE.md) → Раздел "Трансформация товаров Ozon"

#### ...узнать все префиксы
→ [Шпаргалка](./OZON_ARTICLES_CHEATSHEET.md) → Раздел "Быстрый справочник"

#### ...понять архитектуру
→ [Схема](./OZON_ARTICLES_SCHEMA.md) → Раздел "Архитектура системы"

#### ...добавить новую категорию
→ [Руководство](./OZON_ARTICLES_GUIDE.md) → Раздел "Расширение системы"

#### ...посмотреть примеры
→ [Примеры кода](./src/data/ozon-articles-examples.ts) → `runAllExamples()`

#### ...настроить маппинг
→ [Маппер](./src/lib/ozon-article-mapper.ts) → `OZON_TO_ARTICLE_MAP`

#### ...увидеть полную картину
→ [Резюме](./OZON_ARTICLES_SUMMARY.md)

---

## 📊 Формат артикула

```
CLO-DRS-001
│   │   │
│   │   └─── Номер (001-999)
│   └─────── Подкатегория (DRS = dresses)
└─────────── Категория (CLO = clothes)
```

## 🗂️ Все категории

### 🧥 Одежда (CLO)
- `CLO-DRS` - Платья
- `CLO-TOP` - Топы
- `CLO-BLT` - Пояса

### 🏠 Интерьер (INT)
- `INT-LMP` - Абажуры
- `INT-TIP` - Типи
- `INT-PAN` - Панно
- `INT-PLM` - Салфетки
- `INT-PLN` - Кашпо

### 👜 Сумки (BAG)
- `BAG-TOT` - Шопперы
- `BAG-CRS` - Через плечо
- `BAG-BSK` - Корзины

## 🔥 Популярные команды

```typescript
// Создать артикул
import { generateArticle } from '@/data/ozon-article-template';
generateArticle('clothes', 'dresses', 1); // CLO-DRS-001

// Следующий доступный
import { getNextArticle } from '@/data/ozon-article-template';
getNextArticle('interior', 'lampshades', existing); // INT-LMP-003

// Трансформировать товары
import { transformOzonProducts } from '@/lib/ozon-article-mapper';
transformOzonProducts(ozonApiData.result.items);

// Проверить артикул
import { isValidArticle } from '@/data/ozon-article-template';
isValidArticle('CLO-DRS-001'); // true
```

## 📈 Статистика системы

- **Файлов документации:** 6
- **Файлов кода:** 4
- **Категорий:** 3
- **Подкатегорий:** 11
- **Примеров артикулов:** 14
- **Примеров кода:** 9
- **Функций:** 10+
- **Строк кода:** 1000+
- **Строк документации:** 800+

## 🎓 Рекомендуемый порядок изучения

### Уровень 1: Новичок (30 минут)
1. [README](./OZON_ARTICLES_README.md) - 10 мин
2. [Шпаргалка](./OZON_ARTICLES_CHEATSHEET.md) - 5 мин
3. [Примеры кода](./src/data/ozon-articles-examples.ts) - 15 мин

### Уровень 2: Практик (1 час)
1. [Руководство](./OZON_ARTICLES_GUIDE.md) - 30 мин
2. [Код шаблонов](./src/data/ozon-article-template.ts) - 15 мин
3. [Код маппера](./src/lib/ozon-article-mapper.ts) - 15 мин

### Уровень 3: Эксперт (2 часа)
1. [Схема](./OZON_ARTICLES_SCHEMA.md) - 45 мин
2. [Резюме](./OZON_ARTICLES_SUMMARY.md) - 15 мин
3. Все файлы кода - 60 мин

## 🆘 Помощь

**Не можешь найти что-то?**
- Используй поиск по файлам (Ctrl+F)
- Проверь [Шпаргалку](./OZON_ARTICLES_CHEATSHEET.md)
- Посмотри [Примеры](./src/data/ozon-articles-examples.ts)

**Нужна помощь AI?**
- AI имеет доступ к [AI Guide](./.kiro/steering/ozon-articles-ai-guide.md)
- Просто спроси: "Помоги с артикулами Ozon"

## ✅ Система готова к использованию!

Все файлы созданы, протестированы и задокументированы. Начни с [README](./OZON_ARTICLES_README.md) и погружайся в систему! 🚀

---

**Последнее обновление:** 15 мая 2026  
**Версия системы:** 1.0.0  
**Проект:** Stariva - Макраме ручной работы
