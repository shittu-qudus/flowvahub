import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
    Session,
    User,
    AuthError,
    AuthProvider,
    AuthResponse,
    OAuthResponse
} from '../types/supabase';

export class SupabaseService {
    private static client: SupabaseClient;

    static initialize(supabaseUrl: string, supabaseAnonKey: string): void {
        if (!this.client) {
            this.client = createClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            });
        }
    }

    static getClient(): SupabaseClient {
        if (!this.client) {
            throw new Error('Supabase client not initialized. Call initialize() first.');
        }
        return this.client;
    }

    // Email/Password Authentication
    static async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password,
        });

        return {
            data: {
                user: data.user,
                session: data.session,
            },
            error,
        };
    }

    static async signUpWithEmail(
        email: string,
        password: string,
        metadata?: Record<string, any>
    ): Promise<AuthResponse> {
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });

        return {
            data: {
                user: data.user,
                session: data.session,
            },
            error,
        };
    }

    // OAuth Authentication
    static async signInWithOAuth(provider: AuthProvider): Promise<OAuthResponse> {
        const { data, error } = await this.client.auth.signInWithOAuth({
            provider: provider as 'google' | 'github' | 'facebook' | 'azure' | 'gitlab' | 'bitbucket' | 'twitter' | 'discord' | 'apple',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                // You can add more options here:
                // skipBrowserRedirect: false,
                // queryParams: {
                //   access_type: 'offline',
                //   prompt: 'consent',
                // }
            },
        });

        return {
            data: data.url ? { provider, url: data.url } : null,
            error
        };
    }

    // Password Reset
    static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        const { error } = await this.client.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        return { error };
    }

    // Update Password
    static async updatePassword(newPassword: string): Promise<AuthResponse> {
        const { data, error } = await this.client.auth.updateUser({
            password: newPassword,
        });

        return {
            data: {
                user: data.user,
                session: null,
            },
            error,
        };
    }

    // Session Management
    static async getSession(): Promise<AuthResponse> {
        const { data, error } = await this.client.auth.getSession();

        return {
            data: {
                user: data.session?.user || null,
                session: data.session,
            },
            error,
        };
    }

    static async getUser(): Promise<{ data: { user: User | null }; error: AuthError | null }> {
        const { data, error } = await this.client.auth.getUser();

        return {
            data: {
                user: data.user,
            },
            error,
        };
    }

    // Sign Out
    static async signOut(): Promise<{ error: AuthError | null }> {
        const { error } = await this.client.auth.signOut();
        return { error };
    }

    // Auth State Listener
    static onAuthStateChange(
        callback: (event: string, session: Session | null) => void
    ) {
        return this.client.auth.onAuthStateChange(callback);
    }

    // Refresh Session
    static async refreshSession(): Promise<AuthResponse> {
        const { data, error } = await this.client.auth.refreshSession();

        return {
            data: {
                user: data.session?.user || null,
                session: data.session,
            },
            error,
        };
    }
}