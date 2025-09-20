# URL Shortener API

Aplikacja API do skracania URL-i napisana w TypeScript z użyciem Fastify.

## 🏗️ Architektura

Projekt został zrefaktoryzowany zgodnie z wzorcem MVC i zasadami clean architecture:

```
src/
├── config/          # Konfiguracja aplikacji
│   ├── database.ts  # Konfiguracja Prisma
│   ├── redis.ts     # Konfiguracja Redis
│   └── server.ts    # Konfiguracja serwera
├── controllers/     # Kontrolery HTTP
│   ├── LinkController.ts    # Operacje na linkach
│   └── HealthController.ts  # Health checks i diagnostyka
├── services/        # Logika biznesowa
│   └── LinkService.ts       # Serwis obsługi linków
└── routes/          # Definicje tras
    ├── index.ts            # Główny router
    ├── linkRoutes.ts       # Trasy dla linków
    └── healthRoutes.ts     # Trasy diagnostyczne
```

## 🚀 Uruchamianie

### Rozwój

```bash
npm run dev          # Uruchomienie w trybie rozwoju
npm run dev:watch    # Uruchomienie z automatycznym restartowaniem
```

### Produkcja

```bash
npm run build        # Kompilacja TypeScript
npm start           # Uruchomienie skompilowanej aplikacji
```

### Docker

```bash
npm run docker:up   # Uruchomienie z Docker Compose
npm run docker:down # Zatrzymanie kontenerów
```

## 📡 API Endpoints

### Health Checks

- `GET /` - Główny endpoint z informacjami o API
- `GET /test` - Test działania serwera
- `GET /health` - Health check

### Zarządzanie linkami

- `POST /api/links` - Tworzenie nowego skróconego linku
- `GET /api/links/:slug` - Statystyki linku
- `GET /:slug` - Przekierowanie na oryginalny URL

## 🔧 Konfiguracja

### Zmienne środowiskowe

```env
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener
REDIS_URL=redis://localhost:6379
PUBLIC_BASE_URL=http://localhost:3000
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

## 🏗️ Wzorce architektoniczne

### 1. Singleton Pattern

- `DatabaseConfig` - Jedna instancja klienta Prisma
- `RedisConfig` - Jedna instancja klienta Redis

### 2. Dependency Injection

- Kontrolery używają serwisów przez injection
- Czyste rozdzielenie odpowiedzialności

### 3. Layered Architecture

- **Routes** - Obsługa HTTP i routing
- **Controllers** - Logika kontrolerów, walidacja
- **Services** - Logika biznesowa
- **Config** - Konfiguracja i połączenia

## 📚 Korzyści refaktoryzacji

### ✅ Lepsze rozdzielenie odpowiedzialności

- Każda klasa ma jedną, jasno określoną odpowiedzialność
- Logika biznesowa oddzielona od logiki HTTP

### ✅ Łatwiejsze testowanie

- Serwisy można testować niezależnie od kontrolerów
- Mocki i stuby dla dependencies

### ✅ Większa skalowalność

- Łatwe dodawanie nowych endpointów
- Możliwość rozszerzenia o nowe funkcjonalności

### ✅ Lepsze zarządzanie błędami

- Centralizowane obsługiwanie błędów
- Spójne kody odpowiedzi HTTP

### ✅ Lepsza czytelność kodu

- Kod lepiej zorganizowany w logiczne moduły
- Intuicyjna struktura folderów

## 🛠️ Narzędzia deweloperskie

```bash
npm run lint         # Sprawdzenie stylu kodu
npm run lint:fix     # Automatyczne poprawki ESLint
npm run format       # Formatowanie kodu Prettier
npm run type-check   # Sprawdzenie typów TypeScript
```

## 📊 Baza danych

```bash
npm run db:generate  # Generowanie klienta Prisma
npm run db:push      # Wypchanie schematu do bazy
npm run db:migrate   # Wykonanie migracji
npm run db:studio    # Uruchomienie Prisma Studio
```
