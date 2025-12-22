interface EnvironmentVariables {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_APP_NAME: string;
    VITE_APP_URL: string;
    VITE_APP_ENVIRONMENT: 'development' | 'production' | 'test';
    VITE_SUPABASE_REDIRECT_URL: string;
}

class EnvironmentConfig {
    private readonly config: EnvironmentVariables;

    constructor() {
        this.validateEnvironment();

        this.config = {
            VITE_SUPABASE_URL: this.getRequiredVariable('VITE_SUPABASE_URL'),
            VITE_SUPABASE_ANON_KEY: this.getRequiredVariable('VITE_SUPABASE_ANON_KEY'),
            VITE_APP_NAME: this.getVariable('VITE_APP_NAME', 'Flowva'),
            VITE_APP_URL: this.getVariable('VITE_APP_URL', window.location.origin),
            VITE_APP_ENVIRONMENT: this.getEnvironment(),
            VITE_SUPABASE_REDIRECT_URL: this.getVariable(
                'VITE_SUPABASE_REDIRECT_URL',
                `${window.location.origin}/auth/callback`  // Changed to /auth/callback
            ),
        };

        this.logConfiguration();
    }

    private validateEnvironment(): void {
        const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
        const missing = required.filter(key => !import.meta.env[key]);

        if (missing.length > 0) {
            throw new Error(`Missing environment variables: ${missing.join(', ')}`);
        }
    }

    private getRequiredVariable(name: string): string {
        const value = import.meta.env[name];
        if (!value) {
            throw new Error(`Missing required environment variable: ${name}`);
        }
        return value;
    }

    private getVariable<T extends string | undefined>(
        name: string,
        defaultValue: T
    ): T {
        const value = import.meta.env[name];
        return value ? (value as T) : defaultValue;
    }

    private getEnvironment(): 'development' | 'production' | 'test' {
        const env = this.getVariable('VITE_APP_ENVIRONMENT', 'development');
        if (env === 'development' || env === 'production' || env === 'test') {
            return env;
        }
        return 'development';
    }

    private logConfiguration(): void {
        if (this.isDevelopment) {
            console.log('🔧 Environment Configuration:', {
                environment: this.environment,
                appName: this.appName,
                appUrl: this.appUrl,
                supabaseUrl: this.supabaseUrl.substring(0, 30) + '...',
                redirectUrl: this.redirectUrl,
            });
        }
    }

    // Getters
    get supabaseUrl(): string { return this.config.VITE_SUPABASE_URL; }
    get supabaseAnonKey(): string { return this.config.VITE_SUPABASE_ANON_KEY; }
    get appName(): string { return this.config.VITE_APP_NAME; }
    get appUrl(): string { return this.config.VITE_APP_URL; }
    get environment(): string { return this.config.VITE_APP_ENVIRONMENT; }
    get redirectUrl(): string { return this.config.VITE_SUPABASE_REDIRECT_URL; }

    // Helper getters
    get isDevelopment(): boolean { return this.environment === 'development'; }
    get isProduction(): boolean { return this.environment === 'production'; }
    get isTest(): boolean { return this.environment === 'test'; }

    // OAuth redirect URL for Supabase
    get authCallbackUrl(): string {
        return `${this.appUrl}/auth/callback`;
    }
}

export const env = new EnvironmentConfig();