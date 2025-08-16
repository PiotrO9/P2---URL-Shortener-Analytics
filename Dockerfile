FROM node:18-alpine

# przydaje się do TLS/bcrypt; masz już openssl
RUN apk add --no-cache openssl

WORKDIR /app

# kopie deklaracji zależności i prisma
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# instalacja prod+dev
RUN npm ci

# generuj Prisma Client (musi mieć schema)
RUN npm run db:generate

# reszta kodu
COPY . .

EXPOSE 3000

# dev: ts-node-dev/nodemon (poniżej w package.json)
CMD ["npm", "run", "dev"]
