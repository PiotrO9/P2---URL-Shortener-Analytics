import { FastifyInstance } from 'fastify';
import { healthRoutes } from './healthRoutes';
import { linkRoutes } from './linkRoutes';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
	// Rejestruj health routes najpierw (zawierają endpoint główny)
	await fastify.register(healthRoutes);

	// Następnie link routes (przekierowania muszą być na końcu)
	await fastify.register(linkRoutes);
}
