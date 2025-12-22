import { createClient, SupabaseClient, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { env } from '../config/env';
import type {
  Session,
  User,
  AuthError,
  AuthProvider,
  AuthResponse,
  OAuthResponse
} from '../types/supabase';

// Create and export the Supabase client
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'flowva-auth',
    storage: window.localStorage,
    flowType: 'pkce',
    debug: env.isDevelopment,
  },
  global: {
    headers: {
      'x-application-name': env.appName,
      'x-application-environment': env.environment,
    },
  },
});

export class SupabaseService {
  private static client: SupabaseClient = supabase;

  static initialize(supabaseUrl: string, supabaseAnonKey: string): void {
    // Client is already initialized above, but this method exists for compatibility
    console.log('ℹ️  Supabase client already initialized');
  }

  static getClient(): SupabaseClient {
    return this.client;
  }

  // Email/Password Authentication
  static async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
      }

      return {
        data: {
          user: data.user,
          session: data.session,
        },
        error,
      };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  }

  static async signUpWithEmail(
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
      }

      return {
        data: {
          user: data.user,
          session: data.session,
        },
        error,
      };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  }

  // OAuth Authentication
  static async signInWithOAuth(provider: AuthProvider): Promise<OAuthResponse> {
    try {
      const { data, error } = await this.client.auth.signInWithOAuth({
        provider: provider as 'google' | 'github' | 'facebook' | 'azure' | 'gitlab' | 'bitbucket' | 'twitter' | 'discord' | 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      return {
        data: data.url ? { provider, url: data.url } : null,
        error,
      };
    } catch (error) {
      console.error('OAuth error:', error);
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  // Password Reset
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/forget-password`,
      });

      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  }

  // Update Password
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
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
    } catch (error) {
      console.error('Update password error:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  }

  // Session Management
  static async getSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await this.client.auth.getSession();

      return {
        data: {
          user: data.session?.user || null,
          session: data.session,
        },
        error,
      };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  }

  static async getUser(): Promise<{ data: { user: User | null }; error: AuthError | null }> {
    try {
      const { data, error } = await this.client.auth.getUser();

      return {
        data: {
          user: data.user,
        },
        error,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        data: { user: null },
        error: error as AuthError,
      };
    }
  }

  // Sign Out
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await this.client.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  }

  // Auth State Listener
  static onAuthStateChange(
    callback: (event: any, session: Session | null) => void
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // Refresh Session
  static async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await this.client.auth.refreshSession();

      return {
        data: {
          user: data.session?.user || null,
          session: data.session,
        },
        error,
      };
    } catch (error) {
      console.error('Refresh session error:', error);
      return {
        data: { user: null, session: null },
        error: error as AuthError,
      };
    }
  }
}