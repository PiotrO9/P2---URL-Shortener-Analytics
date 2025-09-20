import { FastifyRequest, FastifyReply } from 'fastify';
import { TestResponse, RootResponse } from '../../types';

export class HealthController {
	async test(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const response: TestResponse = {
			message: 'Serwer API działa poprawnie!',
			timestamp: new Date().toISOString(),
			status: 'success',
		};
		reply.send(response);
	}

	async health(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		reply.send({ ok: true });
	}

	async root(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		const response: RootResponse = {
			message: 'Witaj w API Fastify!',
			endpoints: {
				test: '/test - Test działania serwera',
				health: '/health - Status serwera',
				createLink: 'POST /api/links - Tworzenie nowego linku',
				getLinkStats: 'GET /api/links/:slug - Statystyki linku',
				redirect: '/:slug - Przekierowanie do oryginalnego URL',
			},
		};
		reply.send(response);
	}
}
