import { createClient, RedisClientType } from 'redis';

export class RedisConfig {
	private static instance: RedisClientType;

	public static async getInstance(): Promise<RedisClientType> {
		if (!RedisConfig.instance) {
			RedisConfig.instance = createClient({
				url: process.env.REDIS_URL || 'redis://localhost:6379',
			});

			RedisConfig.instance.on('error', err => console.log('Redis Client Error', err));
			RedisConfig.instance.on('connect', () => console.log('🔗 Połączono z Redis'));

			await RedisConfig.instance.connect();
		}
		return RedisConfig.instance;
	}

	public static async disconnect(): Promise<void> {
		if (RedisConfig.instance) {
			await RedisConfig.instance.quit();
		}
	}
}

export const redis = RedisConfig.getInstance();
