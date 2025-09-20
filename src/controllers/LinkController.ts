import { FastifyRequest, FastifyReply } from 'fastify';
import { LinkService } from '../services/LinkService';
import { CreateUrlRequest, GetLinksQuery } from '../../types';

export class LinkController {
	private linkService: LinkService;

	constructor() {
		this.linkService = new LinkService();
	}

	async createLink(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const data = request.body as CreateUrlRequest;
			const result = await this.linkService.createLink(data);
			reply.code(201).send(result);
		} catch (error: any) {
			this.handleError(error, reply);
		}
	}

	async redirectToUrl(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const { slug } = request.params as { slug: string };

			if (!slug) {
				reply.status(400).send({ error: 'Slug is required' });
				return;
			}

			const { url, shouldIncrement } = await this.linkService.redirectToOriginalUrl(slug);

			if (shouldIncrement) {
				await this.linkService.incrementClicks(slug);
			}

			reply.redirect(url);
		} catch (error: any) {
			this.handleRedirectError(error, reply);
		}
	}

	async getLinkStats(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const { slug } = request.params as { slug: string };

			if (!slug) {
				reply.status(400).send({ error: 'Slug is required' });
				return;
			}

			const stats = await this.linkService.getLinkStats(slug);
			reply.send(stats);
		} catch (error: any) {
			this.handleError(error, reply);
		}
	}

	async getAllLinks(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const query = request.query as GetLinksQuery;

			// Convert string parameters to appropriate types
			const parsedQuery: GetLinksQuery = {
				limit: query.limit ? parseInt(query.limit.toString(), 10) : undefined,
				sortBy: query.sortBy,
				order: query.order,
			};

			const result = await this.linkService.getAllLinks(parsedQuery);
			reply.send(result);
		} catch (error: any) {
			this.handleError(error, reply);
		}
	}

	async deactivateLink(request: FastifyRequest, reply: FastifyReply): Promise<void> {
		try {
			const { slug } = request.params as { slug: string };

			if (!slug) {
				reply.status(400).send({ error: 'Slug is required' });
				return;
			}

			await this.linkService.deactivateLink(slug);
			reply.send({ message: 'Link deactivated successfully' });
		} catch (error: any) {
			this.handleError(error, reply);
		}
	}

	private handleError(error: Error, reply: FastifyReply): void {
		console.error('LinkController error:', error);

		if (error.message === 'Invalid URL') {
			reply.status(422).send({
				type: 'invalid_url',
				message: 'Invalid URL',
				status: 422,
			});
			return;
		}

		if (error.message === 'URL has expired') {
			reply.status(422).send({
				type: 'expired_url',
				message: 'URL has expired',
				status: 422,
			});
			return;
		}

		if (error.message === 'Link has been deactivated') {
			reply.status(422).send({
				type: 'deactivated_link',
				message: 'Link has been deactivated',
				status: 422,
			});
			return;
		}

		if (error.message === 'Link not found') {
			reply.status(404).send({ error: 'Link not found' });
			return;
		}

		reply.status(500).send({ error: 'Internal server error' });
	}

	private handleRedirectError(error: Error, reply: FastifyReply): void {
		console.error('Redirect error:', error);

		if (error.message === 'Link not found') {
			reply.status(404).send({ error: 'Link not found' });
			return;
		}

		if (error.message === 'Link has expired') {
			reply.status(410).send({ error: 'Link has expired' });
			return;
		}

		if (error.message === 'Link has been deactivated') {
			reply.status(410).send({ error: 'Link has been deactivated' });
			return;
		}

		reply.status(500).send({ error: 'Internal server error' });
	}
}
