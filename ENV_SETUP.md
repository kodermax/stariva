# Настройка переменных окружения

Проект использует [@t3-oss/env-nextjs](https://env.t3.gg/) для типобезопасного управления переменными окружения.

## Быстрый старт

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Заполните необходимые значения в `.env`

3. Переменные окружения автоматически валидируются при запуске приложения

## Структура

### Файл конфигурации: `lib/env.ts`

Все переменные окружения определены и валидируются в `lib/env.ts` с использованием Zod схем.

### Типы переменных

#### Server-side (серверные)
Доступны только на сервере (API routes, Server Components):
- `OZON_API_KEY` - API ключ Ozon
- `OZON_CLIENT_ID` - Client ID Ozon
- `NODE_ENV` - окружение (development/production/test)

#### Client-side (клиентские)
Доступны в браузере (должны начинаться с `NEXT_PUBLIC_`):
- Пока не используются

## Использование

### В коде

```typescript
import { env } from "@/lib/env"

// Типобезопасный доступ к переменным
const apiKey = env.OZON_API_KEY
const clientId = env.OZON_CLIENT_ID
```

### Преимущества

✅ **Типобезопасность** - TypeScript знает все доступные переменные  
✅ **Валидация** - Ошибки обнаруживаются при запуске, а не в рантайме  
✅ **Автодополнение** - IDE подсказывает доступные переменные  
✅ **Документация** - Все переменные в одном месте  

## Добавление новых переменных

1. Добавьте переменную в `.env`:
   ```
   NEW_API_KEY=your_value
   ```

2. Добавьте схему в `lib/env.ts`:
   ```typescript
   export const env = createEnv({
     server: {
       NEW_API_KEY: z.string().min(1),
       // ...
     },
     runtimeEnv: {
       NEW_API_KEY: process.env.NEW_API_KEY,
       // ...
     },
   })
   ```

3. Используйте в коде:
   ```typescript
   import { env } from "@/lib/env"
   const key = env.NEW_API_KEY
   ```

## Для клиентских переменных

Если нужна переменная в браузере:

1. Добавьте с префиксом `NEXT_PUBLIC_` в `.env`:
   ```
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

2. Добавьте в секцию `client` в `lib/env.ts`:
   ```typescript
   client: {
     NEXT_PUBLIC_API_URL: z.string().url(),
   },
   runtimeEnv: {
     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
   },
   ```

## CI/CD

Для пропуска валидации в CI/CD (если переменные устанавливаются позже):
```bash
SKIP_ENV_VALIDATION=true npm run build
```

## Безопасность

- ❌ Никогда не коммитьте `.env` файлы
- ✅ Используйте `.env.example` для документации
- ✅ Серверные переменные никогда не попадут в клиентский бандл
- ✅ Клиентские переменные должны начинаться с `NEXT_PUBLIC_`
