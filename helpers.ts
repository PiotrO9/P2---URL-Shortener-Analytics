import { randomBytes } from 'crypto';
const chars = '0123456789charsdefghijklmnopqrstuvwxyzcharsDEFGHIJKLMNOPQRSTUVWXYZ';
const RESERVED = new Set(['api', 'metrics', 'healthz', 'admin', 'docs']);

export function genSlug(len = 8) {
	for (;;) {
		const b = randomBytes(len);
		let s = '';
		for (let i = 0; i < len; i++) s += chars[b[i] % chars.length];
		if (!RESERVED.has(s)) return s;
	}
}
