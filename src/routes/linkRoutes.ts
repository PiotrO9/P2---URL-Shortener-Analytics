import { FastifyInstance } from 'fastify';
import { LinkController } from '../controllers/LinkController';

export async function linkRoutes(fastify: FastifyInstance): Promise<void> {
	const linkController = new LinkController();

	// Tworzenie nowego linku
	fastify.post('/api/links', {
		handler: linkController.createLink.bind(linkController),
	});

	// Pobieranie wszystkich linków z możliwością sortowania i limitowania
	fastify.get('/api/links', {
		handler: linkController.getAllLinks.bind(linkController),
	});

	// Statystyki linku
	fastify.get('/api/links/:slug', {
		handler: linkController.getLinkStats.bind(linkController),
	});

	// Dezaktywacja linku
	fastify.patch('/api/links/:slug/deactivate', {
		handler: linkController.deactivateLink.bind(linkController),
	});

	// Przekierowanie (musi być na końcu, żeby nie kolidowało z innymi routes)
	fastify.get('/:slug', {
		handler: linkController.redirectToUrl.bind(linkController),
	});
}
