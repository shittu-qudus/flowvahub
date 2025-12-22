// Import core Supabase types - we'll use these directly
import type { Session, User, AuthError } from '@supabase/supabase-js';

// Re-export Supabase types for convenience
export type { Session, User, AuthError };

// Auth Provider Type - only define once
export type AuthProvider = 'google' | 'github' | 'facebook' | 'azure' | 'gitlab' | 'bitbucket' | 'twitter' | 'discord' | 'apple';

// Auth Response Types
export interface AuthResponse {
    data: {
        user: User | null;
        session: Session | null;
    };
    error: AuthError | null;
}

export interface OAuthResponse {
    data: {
        provider: string;
        url: string;
    } | null;
    error: AuthError | null;
}

// Login Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginFormState {
    email: string;
    password: string;
    showPassword: boolean;
    isLoading: boolean;
    error: string;
}

export interface LoginPageProps {
    redirectPath?: string;
    onLoginSuccess?: (session: Session) => void;
    onLoginError?: (error: AuthError | Error) => void;
}

// Sign Up Types
export interface SignUpCredentials {
    email: string;
    password: string;
    confirmPassword: string;
    fullName?: string;
}

export interface SignUpFormState {
    email: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    isLoading: boolean;
    error: string;
    success: boolean;
}

export interface SignUpResponse {
    success: boolean;
    message: string;
    userId?: string;
    requiresEmailVerification: boolean;
}

export interface SignUpPageProps {
    onSignUpSuccess?: (response: SignUpResponse) => void;
    onSignUpError?: (error: AuthError | Error) => void;
    redirectPath?: string;
}

// Password Validation
export interface PasswordValidation {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    messages: string[];
}

// Profile Types
export interface Profile {
    id: string;
    updated_at: string;
    created_at: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    website?: string;
    email?: string;
}

export interface InsertProfile {
    id: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    username?: string;
    website?: string;
    updated_at?: string;
    created_at?: string;
}

// Database type (you can expand this based on your database schema)
export type Database = any;

// SupabaseService interface
export interface SupabaseServiceInterface {
    signInWithEmail: (email: string, password: string) => Promise<AuthResponse>;
    signInWithOAuth: (provider: AuthProvider) => Promise<OAuthResponse>;
    signUpWithEmail: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<AuthResponse>;
    resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
    getSession: () => Promise<AuthResponse>;
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        data: {
            subscription: {
                unsubscribe: () => void;
            }
        }
    };
}