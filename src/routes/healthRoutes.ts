import { FastifyInstance } from 'fastify';
import { HealthController } from '../controllers/HealthController';

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
	const healthController = new HealthController();

	// Test działania serwera
	fastify.get('/test', {
		handler: healthController.test.bind(healthController),
	});

	// Health check
	fastify.get('/health', {
		handler: healthController.health.bind(healthController),
	});

	// Endpoint główny
	fastify.get('/', {
		handler: healthController.root.bind(healthController),
	});
}
