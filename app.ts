import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TestResponse, RootResponse, ServerConfig, CreateUrlRequest } from './types/index';
import { genSlug } from './helpers';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

const serverConfig: ServerConfig = {
	port: 3000,
	host: '0.0.0.0',
	logger: true,
};

const server: FastifyInstance = fastify(serverConfig);

// Inicjalizacja Redis
const redis = createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', err => console.log('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

server.get<{ Reply: TestResponse }>('/test', async () => {
	return {
		message: 'Serwer API działa poprawnie!',
		timestamp: new Date().toISOString(),
		status: 'success',
	};
});

server.post('/api/links', async (request: FastifyRequest, reply: FastifyReply) => {
	const { originalUrl, expiresAt } = request.body as CreateUrlRequest;

	try {
		new URL(originalUrl);
	} catch {
		return reply.status(422).send({ type: 'invalid_url', message: 'Invalid URL', status: 422 });
	}

	const exp = expiresAt ? new Date(expiresAt) : null;

	if (exp && exp < new Date()) {
		return reply.status(422).send({ type: 'expired_url', message: 'URL has expired', status: 422 });
	}

	const prisma = new PrismaClient();

	for (let i = 0; i < 3; i++) {
		const slug = genSlug(8);

		try {
			const link = await prisma.link.create({
				data: {
					slug,
					url: originalUrl,
					expiresAt: exp,
					clicks: 0,
				},
			});

			// 3) opcjonalny warm cache
			await redis.set(`s:${slug}`, originalUrl, { EX: 600 });

			return reply.code(201).send({
				id: link.id,
				slug: link.slug,
				shortUrl: `${process.env.PUBLIC_BASE_URL}/${link.slug}`,
				createdAt: link.createdAt,
				expiresAt: link.expiresAt,
			});
		} catch (e: any) {
			if (e.code !== 'P2002') throw e; // nie-unikatowy slug
		}
	}
});

// Endpoint do przekierowywania linków
server.get('/:slug', async (request: FastifyRequest, reply: FastifyReply) => {
	const { slug } = request.params as { slug: string };

	if (!slug) {
		return reply.status(400).send({ error: 'Slug is required' });
	}

	const prisma = new PrismaClient();

	try {
		// Sprawdź cache Redis
		const cachedUrl = await redis.get(`s:${slug}`);
		if (cachedUrl) {
			// Zwiększ licznik kliknięć w tle
			prisma.link
				.update({
					where: { slug },
					data: { clicks: { increment: 1 } },
				})
				.catch(console.error);

			return reply.redirect(cachedUrl);
		}

		// Jeśli nie ma w cache, pobierz z bazy
		const link = await prisma.link.findUnique({
			where: { slug },
		});

		if (!link) {
			return reply.status(404).send({ error: 'Link not found' });
		}

		// Sprawdź czy link nie wygasł
		if (link.expiresAt && link.expiresAt < new Date()) {
			return reply.status(410).send({ error: 'Link has expired' });
		}

		// Zwiększ licznik kliknięć
		await prisma.link.update({
			where: { slug },
			data: { clicks: { increment: 1 } },
		});

		// Dodaj do cache
		await redis.set(`s:${slug}`, link.url, { EX: 600 });

		return reply.redirect(link.url);
	} catch (error) {
		console.error('Error redirecting link:', error);
		return reply.status(500).send({ error: 'Internal server error' });
	}
});

// Endpoint do pobierania statystyk linku
server.get('/api/links/:slug', async (request: FastifyRequest, reply: FastifyReply) => {
	const { slug } = request.params as { slug: string };

	if (!slug) {
		return reply.status(400).send({ error: 'Slug is required' });
	}

	const prisma = new PrismaClient();

	try {
		const link = await prisma.link.findUnique({
			where: { slug },
			select: {
				id: true,
				slug: true,
				url: true,
				clicks: true,
				createdAt: true,
				expiresAt: true,
				ownerId: true,
			},
		});

		if (!link) {
			return reply.status(404).send({ error: 'Link not found' });
		}

		return reply.send({
			id: link.id,
			slug: link.slug,
			url: link.url,
			clicks: link.clicks,
			createdAt: link.createdAt,
			expiresAt: link.expiresAt,
			ownerId: link.ownerId,
			shortUrl: `${process.env.PUBLIC_BASE_URL}/${link.slug}`,
		});
	} catch (error) {
		console.error('Error getting link stats:', error);
		return reply.status(500).send({ error: 'Internal server error' });
	}
});

server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
	return { ok: true };
});

// Endpoint główny - musi być na końcu aby nie kolidował z /:slug
server.get<{ Reply: RootResponse }>('/', async () => {
	return {
		message: 'Witaj w API Fastify!',
		endpoints: {
			test: '/test - Test działania serwera',
			health: '/health - Status serwera',
			createLink: 'POST /api/links - Tworzenie nowego linku',
			getLinkStats: 'GET /api/links/:slug - Statystyki linku',
			redirect: '/:slug - Przekierowanie do oryginalnego URL',
		},
	};
});

async function start(): Promise<void> {
	try {
		// Połącz z Redis
		await redis.connect();
		console.log('🔗 Połączono z Redis');

		await server.listen({
			port: 3000,
			host: '0.0.0.0',
		});
		console.log('🚀 Serwer API uruchomiony na porcie 3000');
		console.log('📍 Testowy endpoint: http://localhost:3000/test');
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

// Graceful shutdown
process.on('SIGINT', async () => {
	console.log('\n🛑 Otrzymano sygnał SIGINT, zamykanie aplikacji...');
	await redis.quit();
	await server.close();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('\n🛑 Otrzymano sygnał SIGTERM, zamykanie aplikacji...');
	await redis.quit();
	await server.close();
	process.exit(0);
});

start();
