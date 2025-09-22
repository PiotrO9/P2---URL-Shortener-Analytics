# URL Shortener API

A URL shortening API application written in TypeScript using Fastify.

## 🏗️ Architecture

The project has been refactored according to the MVC pattern and clean architecture principles:

```
src/
├── config/          # Application configuration
│   ├── database.ts  # Prisma configuration
│   ├── redis.ts     # Redis configuration
│   └── server.ts    # Server configuration
├── controllers/     # HTTP controllers
│   ├── LinkController.ts    # Link operations
│   └── HealthController.ts  # Health checks and diagnostics
├── services/        # Business logic
│   └── LinkService.ts       # Link management service
└── routes/          # Route definitions
    ├── index.ts            # Main router
    ├── linkRoutes.ts       # Link routes
    └── healthRoutes.ts     # Diagnostic routes
```

## 🚀 Getting Started

### Development

```bash
npm run dev          # Run in development mode
npm run dev:watch    # Run with automatic restart
```

### Production

```bash
npm run build        # Compile TypeScript
npm start           # Run compiled application
```

### Docker

```bash
npm run docker:up   # Run with Docker Compose
npm run docker:down # Stop containers
```

## 📡 API Endpoints

### Health Checks

- `GET /` - Main endpoint with API information
- `GET /test` - Server functionality test
- `GET /health` - Health check

### Link Management

- `POST /api/links` - Create a new shortened link
- `GET /api/links` - Get all links with sorting and limiting options
- `GET /api/links/:slug` - Get link statistics
- `PATCH /api/links/:slug/deactivate` - Deactivate a link
- `GET /:slug` - Redirect to original URL

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/urlshortener
REDIS_URL=redis://localhost:6379
PUBLIC_BASE_URL=http://localhost:3000
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

## 🏗️ Architectural Patterns

### 1. Singleton Pattern

- `DatabaseConfig` - Single instance of Prisma client
- `RedisConfig` - Single instance of Redis client

### 2. Dependency Injection

- Controllers use services through injection
- Clean separation of concerns

### 3. Layered Architecture

- **Routes** - HTTP handling and routing
- **Controllers** - Controller logic, validation
- **Services** - Business logic
- **Config** - Configuration and connections

## 📚 Refactoring Benefits

### ✅ Better Separation of Concerns

- Each class has a single, clearly defined responsibility
- Business logic separated from HTTP logic

### ✅ Easier Testing

- Services can be tested independently from controllers
- Mocks and stubs for dependencies

### ✅ Greater Scalability

- Easy addition of new endpoints
- Possibility to extend with new functionality

### ✅ Better Error Handling

- Centralized error handling
- Consistent HTTP response codes

### ✅ Better Code Readability

- Code better organized into logical modules
- Intuitive folder structure

## 🛠️ Development Tools

```bash
npm run lint         # Check code style
npm run lint:fix     # Automatic ESLint fixes
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

## 📊 Database

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Launch Prisma Studio
```

## 📋 API Request Examples

### Create Link

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com", "expiresAt": "2025-12-31T23:59:59Z"}'
```

### Get All Links

```bash
# Basic request
curl http://localhost:3000/api/links

# With sorting and limiting
curl "http://localhost:3000/api/links?sortBy=createdAt&sortOrder=desc&limit=10"
```

### Get Link Statistics

```bash
curl http://localhost:3000/api/links/abc123
```

### Deactivate Link

```bash
curl -X PATCH http://localhost:3000/api/links/abc123/deactivate
```

### Redirect

```bash
curl -L http://localhost:3000/abc123
```

## 🔒 Link Features

- **URL Validation**: Validates URLs before creating short links
- **Expiration Dates**: Optional expiration for links
- **Click Tracking**: Tracks number of clicks on each link
- **Link Deactivation**: Ability to deactivate links without deletion
- **Custom Slugs**: Generates unique slugs for each shortened URL
- **Statistics**: Detailed statistics for each link including click count and creation date
