export interface TestResponse {
	message: string;
	timestamp: string;
	status: string;
}

export interface RootResponse {
	message: string;
	endpoints: {
		test: string;
		health: string;
		createLink: string;
		getAllLinks: string;
		getLinkStats: string;
		redirect: string;
	};
}

export interface ServerConfig {
	port: number;
	host: string;
	logger: boolean;
}

export interface CreateUrlRequest {
	originalUrl: string;
	expiresAt?: string;
}

export interface LinkResponse {
	id: string;
	slug: string;
	shortUrl: string;
	createdAt: Date;
	expiresAt: Date | null;
}

export interface LinkStatsResponse {
	id: string;
	slug: string;
	url: string;
	clicks: number;
	createdAt: Date;
	expiresAt: Date | null;
	ownerId: string | null;
	shortUrl: string;
}

export interface ErrorResponse {
	error: string;
	type?: string;
	message?: string;
	status?: number;
}

export type SortField = 'clicks' | 'createdAt' | 'expiresAt';
export type SortOrder = 'asc' | 'desc';

export interface GetLinksQuery {
	limit?: number;
	sortBy?: SortField;
	order?: SortOrder;
}

export interface GetLinksResponse {
	links: LinkStatsResponse[];
	total: number;
	limit: number;
	sortBy: SortField;
	order: SortOrder;
}
