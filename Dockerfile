FROM node:18-alpine

# Dodaj OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Kopiuj pliki konfiguracyjne
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Zainstaluj zależności
RUN npm ci

# Wygeneruj Prisma Client
RUN npm run db:generate

# Kopiuj kod źródłowy
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
