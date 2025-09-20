import fastify, { FastifyInstance } from 'fastify';
import { serverConfig } from './src/config/server';
import { registerRoutes } from './src/routes';
import { RedisConfig } from './src/config/redis';
import { DatabaseConfig } from './src/config/database';

const server: FastifyInstance = fastify(serverConfig);

async function start(): Promise<void> {
	try {
		// Połącz z Redis
		await RedisConfig.getInstance();

		// Zarejestruj wszystkie routes
		await registerRoutes(server);

		await server.listen({
			port: serverConfig.port,
			host: serverConfig.host,
		});

		console.log('🚀 Serwer API uruchomiony na porcie', serverConfig.port);
		console.log('📍 Testowy endpoint: http://localhost:3000/test');
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

// Graceful shutdown
async function gracefulShutdown(): Promise<void> {
	console.log('\n🛑 Zamykanie aplikacji...');

	try {
		await RedisConfig.disconnect();
		await DatabaseConfig.disconnect();
		await server.close();
		console.log('✅ Aplikacja zamknięta pomyślnie');
	} catch (error) {
		console.error('❌ Błąd podczas zamykania:', error);
	}

	process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

start();
