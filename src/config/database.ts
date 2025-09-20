import { PrismaClient } from '@prisma/client';

export class DatabaseConfig {
	private static instance: PrismaClient;

	public static getInstance(): PrismaClient {
		if (!DatabaseConfig.instance) {
			DatabaseConfig.instance = new PrismaClient();
		}
		return DatabaseConfig.instance;
	}

	public static async disconnect(): Promise<void> {
		if (DatabaseConfig.instance) {
			await DatabaseConfig.instance.$disconnect();
		}
	}
}

export const prisma = DatabaseConfig.getInstance();
