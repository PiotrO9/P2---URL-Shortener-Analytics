export interface ServerConfig {
	port: number;
	host: string;
	logger: boolean;
}

export const serverConfig: ServerConfig = {
	port: parseInt(process.env.PORT || '3000'),
	host: process.env.HOST || '0.0.0.0',
	logger: process.env.NODE_ENV !== 'production',
};
