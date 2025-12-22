import { useState, useEffect } from 'react';
import { SupabaseService } from '../lib/supabase';
import type { Session } from '../types/supabase';

interface UseAuthReturn {
    session: Session | null;
    isLoading: boolean;
    error: string | null;
    signOut: () => Promise<void>;
}export function useAuth(): UseAuthReturn {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async (): Promise<void> => {
            try {
                // Use type casting
                const { data, error: sessionError } = await SupabaseService.getSession() as {
                    data: { session: Session | null };
                    error: Error | null;
                };

                if (sessionError) {
                    throw new Error(sessionError.message);
                }

                setSession(data.session);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'Failed to initialize authentication';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Use type casting here too
        const { data: { subscription } } = SupabaseService.onAuthStateChange(
            (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'TOKEN_REFRESHED', session: Session | null) => {
                setSession(session);
                setIsLoading(false);

                if (event === 'SIGNED_OUT') {
                    setSession(null);
                }
            }
        ) as {
            data: { subscription: { unsubscribe: () => void } };
        };

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async (): Promise<void> => {
        try {
            const { error } = await SupabaseService.signOut();
            if (error) throw error;
            setSession(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to sign out';
            setError(errorMessage);
        }
    };

    return { session, isLoading, error, signOut };
}