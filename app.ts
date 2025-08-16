import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TestResponse, RootResponse, ServerConfig } from './types/index';

const serverConfig: ServerConfig = {
	port: 3000,
	host: '0.0.0.0',
	logger: true,
};

const server: FastifyInstance = fastify(serverConfig);

server.get<{ Reply: TestResponse }>(
	'/test',
	async (request: FastifyRequest, reply: FastifyReply) => {
		return {
			message: 'Serwer API działa poprawnie!',
			timestamp: new Date().toISOString(),
			status: 'success',
		};
	},
);

server.get<{ Reply: RootResponse }>('/', async (request: FastifyRequest, reply: FastifyReply) => {
	return {
		message: 'Witaj w API Fastify!',
		endpoints: {
			test: '/test - Test działania serwera',
			health: '/health - Status serwera',
		},
	};
});

server.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
	return {
		status: 'healthy',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	};
});

async function start(): Promise<void> {
	try {
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

start();
