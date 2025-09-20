import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { genSlug } from '../../helpers';
import {
	CreateUrlRequest,
	LinkResponse,
	LinkStatsResponse,
	GetLinksQuery,
	GetLinksResponse,
	SortField,
	SortOrder,
} from '../../types';

export class LinkService {
	private static readonly CACHE_TTL = 600; // 10 minut
	private static readonly MAX_SLUG_ATTEMPTS = 3;

	async createLink(data: CreateUrlRequest): Promise<LinkResponse> {
		this.validateUrl(data.originalUrl);

		const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
		this.validateExpiration(expiresAt);

		for (let i = 0; i < LinkService.MAX_SLUG_ATTEMPTS; i++) {
			const slug = genSlug(8);

			try {
				const link = await prisma.link.create({
					data: {
						slug,
						url: data.originalUrl,
						expiresAt,
						clicks: 0,
					},
				});

				// Dodaj do cache
				const redisClient = await redis;
				await redisClient.set(`s:${slug}`, data.originalUrl, {
					EX: LinkService.CACHE_TTL,
				});

				return {
					id: link.id,
					slug: link.slug,
					shortUrl: `${process.env.PUBLIC_BASE_URL}/${link.slug}`,
					createdAt: link.createdAt,
					expiresAt: link.expiresAt,
					isActive: link.isActive,
				};
			} catch (error: any) {
				if (error.code !== 'P2002') {
					throw error; // Błąd inny niż duplikat slug
				}
				// Spróbuj ponownie z nowym slug
			}
		}

		throw new Error('Nie udało się wygenerować unikalnego slug po 3 próbach');
	}

	async redirectToOriginalUrl(slug: string): Promise<{ url: string; shouldIncrement: boolean }> {
		const redisClient = await redis;

		// Sprawdź cache Redis
		const cachedUrl = await redisClient.get(`s:${slug}`);
		if (cachedUrl) {
			// Zwiększ licznik w tle (bez czekania)
			this.incrementClicksAsync(slug);
			return { url: cachedUrl, shouldIncrement: false };
		}

		// Pobierz z bazy danych
		const link = await prisma.link.findUnique({
			where: { slug },
		});

		if (!link) {
			throw new Error('Link not found');
		}

		// Sprawdź czy link jest aktywny
		if (!link.isActive) {
			throw new Error('Link has been deactivated');
		}

		// Sprawdź czy link nie wygasł
		if (link.expiresAt && link.expiresAt < new Date()) {
			throw new Error('Link has expired');
		}

		// Dodaj do cache
		await redisClient.set(`s:${slug}`, link.url, {
			EX: LinkService.CACHE_TTL,
		});

		return { url: link.url, shouldIncrement: true };
	}

	async getLinkStats(slug: string): Promise<LinkStatsResponse> {
		const link = await prisma.link.findUnique({
			where: { slug },
			select: {
				id: true,
				slug: true,
				url: true,
				clicks: true,
				createdAt: true,
				expiresAt: true,
				isActive: true,
				ownerId: true,
			},
		});

		if (!link) {
			throw new Error('Link not found');
		}

		// Sprawdź czy link jest aktywny
		if (!link.isActive) {
			throw new Error('Link has been deactivated');
		}

		// Sprawdź czy link nie wygasł
		if (link.expiresAt && link.expiresAt < new Date()) {
			throw new Error('Link has expired');
		}

		return {
			id: link.id,
			slug: link.slug,
			url: link.url,
			clicks: link.clicks,
			createdAt: link.createdAt,
			expiresAt: link.expiresAt,
			isActive: link.isActive,
			ownerId: link.ownerId,
			shortUrl: `${process.env.PUBLIC_BASE_URL}/${link.slug}`,
		};
	}

	async incrementClicks(slug: string): Promise<void> {
		await prisma.link.update({
			where: { slug },
			data: { clicks: { increment: 1 } },
		});
	}

	async deactivateLink(slug: string): Promise<void> {
		const link = await prisma.link.findUnique({
			where: { slug },
		});

		if (!link) {
			throw new Error('Link not found');
		}

		await prisma.link.update({
			where: { slug },
			data: { isActive: false },
		});

		// Usuń z cache Redis
		const redisClient = await redis;
		await redisClient.del(`s:${slug}`);
	}

	async getAllLinks(query: GetLinksQuery = {}): Promise<GetLinksResponse> {
		const { limit = 50, sortBy = 'createdAt', order = 'desc' } = query;

		// Validation
		if (limit < 1 || limit > 1000) {
			throw new Error('Limit must be between 1 and 1000');
		}

		// Build orderBy object for Prisma
		const orderBy = this.buildOrderBy(sortBy, order);

		// Get total count
		const total = await prisma.link.count();

		// Get links with sorting and limit
		const links = await prisma.link.findMany({
			take: limit,
			orderBy,
			select: {
				id: true,
				slug: true,
				url: true,
				clicks: true,
				createdAt: true,
				expiresAt: true,
				isActive: true,
				ownerId: true,
			},
		});

		// Transform to response format
		const formattedLinks: LinkStatsResponse[] = links.map(link => ({
			id: link.id,
			slug: link.slug,
			url: link.url,
			clicks: link.clicks,
			createdAt: link.createdAt,
			expiresAt: link.expiresAt,
			isActive: link.isActive,
			ownerId: link.ownerId,
			shortUrl: `${process.env.PUBLIC_BASE_URL}/${link.slug}`,
		}));

		return {
			links: formattedLinks,
			total,
			limit,
			sortBy,
			order,
		};
	}

	private buildOrderBy(sortBy: SortField, order: SortOrder): any {
		const orderByMap = {
			clicks: { clicks: order },
			createdAt: { createdAt: order },
			expiresAt: { expiresAt: order },
		};

		return orderByMap[sortBy];
	}

	private async incrementClicksAsync(slug: string): Promise<void> {
		try {
			await this.incrementClicks(slug);
		} catch (error) {
			console.error('Błąd podczas zwiększania licznika kliknięć:', error);
		}
	}

	private validateUrl(url: string): void {
		try {
			new URL(url);
		} catch {
			throw new Error('Invalid URL');
		}
	}

	private validateExpiration(expiresAt: Date | null): void {
		if (expiresAt && expiresAt < new Date()) {
			throw new Error('URL has expired');
		}
	}
}
