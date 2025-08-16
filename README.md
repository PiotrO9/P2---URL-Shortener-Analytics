# Fastify API z TypeScript

Prosta aplikacja API zbudowana z Fastify i TypeScript, z konfiguracją ESLint i Prettier.

## Instalacja

```bash
npm install
```

## Skrypty

- `npm run build` - Kompilacja TypeScript do JavaScript
- `npm start` - Uruchomienie skompilowanej aplikacji
- `npm run dev` - Uruchomienie w trybie deweloperskim z ts-node
- `npm run dev:watch` - Uruchomienie z automatycznym restartem
- `npm run lint` - Sprawdzenie kodu ESLint
- `npm run lint:fix` - Automatyczne poprawki ESLint
- `npm run format` - Formatowanie kodu Prettier
- `npm run type-check` - Sprawdzenie typów TypeScript

## Endpointy

- `GET /` - Strona główna z informacjami o API
- `GET /test` - Testowy endpoint do weryfikacji działania
- `GET /health` - Status serwera i uptime

## Konfiguracja

- **ESLint**: Konfiguracja z regułami TypeScript
- **Prettier**: Formatowanie z tabami (szerokość 1)
- **TypeScript**: Strict mode z generowaniem deklaracji

## Uruchomienie

1. Zainstaluj zależności: `npm install`
2. Uruchom w trybie deweloperskim: `npm run dev`
3. Otwórz w przeglądarce: http://localhost:3000/test

## Budowanie produkcyjne

```bash
npm run build
npm start
```
