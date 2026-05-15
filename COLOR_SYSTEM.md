# Система отображения цветов

## Обзор

Реализована система визуального отображения цветов товаров с использованием цветовых индикаторов (color swatches). Цвета отображаются как в карточках товаров в каталоге, так и на детальной странице товара.

## Компоненты

### 1. Утилиты для работы с цветами (`src/lib/colors.ts`)

**Основные функции:**

- `getColorInfo(colorName)` - получает информацию о цвете по его названию
- `parseMultipleColors(colorString)` - парсит строку с несколькими цветами (например, "Белый, Бежевый")
- `isGradientColor(colorInfo)` - проверяет, является ли цвет градиентом

**Поддерживаемые цвета:**

- Базовые: белый, черный, серый, бежевый, коричневый
- Теплые: красный, розовый, оранжевый, желтый, персиковый, терракотовый
- Холодные: синий, голубой, фиолетовый, сиреневый
- Природные: зеленый, оливковый, мятный, хаки
- Натуральные (для макраме): натуральный хлопок, экрю, слоновая кость, кремовый, песочный
- Специальные: разноцветный, многоцветный (отображаются градиентом)

**Добавление новых цветов:**

```typescript
export const COLOR_MAP: Record<string, ColorInfo> = {
  // ...существующие цвета
  "новый_цвет": { 
    name: "Новый цвет", 
    hex: "#HEXCODE",
    textColor: "#2C2416" // опционально, для светлых цветов
  },
};
```

### 2. Компоненты индикаторов (`src/components/stariva/color-indicator.tsx`)

**ColorIndicator** - отображает один цветовой индикатор

Пропсы:
- `color: ColorInfo` - информация о цвете
- `size?: "sm" | "md" | "lg"` - размер индикатора (по умолчанию "md")
- `showLabel?: boolean` - показывать ли название цвета
- `className?: string` - дополнительные CSS классы

**ColorSwatches** - отображает группу цветовых индикаторов

Пропсы:
- `colors: ColorInfo[]` - массив цветов
- `size?: "sm" | "md" | "lg"` - размер индикаторов
- `maxDisplay?: number` - максимальное количество отображаемых индикаторов (по умолчанию 5)
- `className?: string` - дополнительные CSS классы

## Использование

### В карточке товара (каталог)

```tsx
import { ColorSwatches } from "@/components/stariva/color-indicator";
import { parseMultipleColors } from "@/lib/colors";

const productColors = parseMultipleColors(product.color);

{productColors.length > 0 && (
  <div className="absolute bottom-3 left-3 bg-parchment/90 backdrop-blur-sm rounded-full px-2.5 py-1.5 shadow-sm">
    <ColorSwatches colors={productColors} size="sm" maxDisplay={3} />
  </div>
)}
```

### На странице товара

```tsx
import { ColorSwatches } from "@/components/stariva/color-indicator";
import { parseMultipleColors } from "@/lib/colors";

const productColors = parseMultipleColors(product.color);

{product.color && productColors.length > 0 && (
  <div className="flex flex-col items-center justify-center text-center p-4 bg-sand rounded-xl">
    <span className="label-caps text-[9px] text-taupe/60 mb-3">Цвет</span>
    <div className="flex flex-col items-center gap-2">
      <ColorSwatches colors={productColors} size="lg" />
      <span className="label-caps text-[11px] text-espresso leading-snug mt-1">
        {product.color}
      </span>
    </div>
  </div>
)}
```

## Особенности

1. **Автоматическое определение цвета** - система пытается найти цвет по частичному совпадению, если точное название не найдено

2. **Поддержка множественных цветов** - можно указывать несколько цветов через запятую, точку с запятой или слэш

3. **Градиенты для разноцветных товаров** - товары с цветом "разноцветный" или "многоцветный" отображаются с радужным градиентом

4. **Адаптивные размеры** - три размера индикаторов (sm: 20px, md: 28px, lg: 40px)

5. **Hover эффекты** - индикаторы увеличиваются при наведении

6. **Accessibility** - каждый индикатор имеет `title` и `aria-label` с названием цвета

## Примеры

### Один цвет
```
product.color = "Бежевый"
→ Отображается один бежевый индикатор
```

### Несколько цветов
```
product.color = "Белый, Бежевый, Серый"
→ Отображаются три индикатора соответствующих цветов
```

### Разноцветный товар
```
product.color = "Разноцветный"
→ Отображается индикатор с радужным градиентом
```

### Неизвестный цвет
```
product.color = "Какой-то новый цвет"
→ Отображается индикатор с дефолтным бежевым цветом
```

## Стилизация

Цветовые индикаторы используют следующие стили:
- Круглая форма (`rounded-full`)
- Граница с прозрачностью (`border-2 border-espresso/20`)
- Тень (`shadow-sm`)
- Плавный переход при hover (`transition-transform hover:scale-110`)
- Полупрозрачный фон для оверлея в каталоге (`bg-parchment/90 backdrop-blur-sm`)
