export interface TestResponse {
	message: string;
	timestamp: string;
	status: string;
}

export interface HealthResponse {
	status: string;
	uptime: number;
	timestamp: string;
}

export interface RootResponse {
	message: string;
	endpoints: {
		test: string;
		health: string;
	};
}

export interface CreateUrlRequest {
	originalUrl: string;
	customAlias?: string;
}

export interface UrlResponse {
	id: string;
	originalUrl: string;
	shortUrl: string;
	alias: string;
	createdAt: string;
	clicks: number;
}

export interface ApiError {
	error: string;
	message: string;
	statusCode: number;
	timestamp: string;
}

export interface ServerConfig {
	port: number;
	host: string;
	logger: boolean;
}

export interface RequestContext {
	userId?: string;
	ip: string;
	userAgent: string;
}

export interface ValidationError {
	field: string;
	message: string;
	value?: any;
}

export interface PaginationParams {
	page: number;
	limit: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface LogEntry {
	level: 'info' | 'warn' | 'error' | 'debug';
	message: string;
	timestamp: string;
	context?: Record<string, any>;
}

export interface ApiMetadata {
	version: string;
	environment: 'development' | 'staging' | 'production';
	buildDate: string;
	uptime: number;
}
