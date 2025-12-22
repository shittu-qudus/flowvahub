export class SecurityUtils {
    /**
     * Rate limiting helper
     */
    private static rateLimitStore = new Map<string, { count: number; timestamp: number }>();

    static checkRateLimit(key: string, limit: number, windowMs: number): boolean {
        const now = Date.now();
        const record = this.rateLimitStore.get(key);

        if (!record) {
            this.rateLimitStore.set(key, { count: 1, timestamp: now });
            return true;
        }

        // Reset if window has passed
        if (now - record.timestamp > windowMs) {
            this.rateLimitStore.set(key, { count: 1, timestamp: now });
            return true;
        }

        // Check if limit exceeded
        if (record.count >= limit) {
            return false;
        }

        // Increment count
        record.count++;
        return true;
    }

    /**
     * Clear old rate limit records
     */
    static cleanupRateLimit(olderThanMs: number = 3600000): void {
        const now = Date.now();
        for (const [key, record] of this.rateLimitStore.entries()) {
            if (now - record.timestamp > olderThanMs) {
                this.rateLimitStore.delete(key);
            }
        }
    }

    /**
     * Sanitize email input
     */
    static sanitizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    /**
     * Validate password reset token format
     */
    static isValidResetToken(token: string): boolean {
        // Basic validation - adjust based on your token format
        return token.length > 20 && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
    }
}