import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { SupabaseService } from './lib/supabase';
import type { Session } from './types/supabase';

interface AuthGuardProps {
    children: React.ReactNode;
}

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'TOKEN_REFRESHED';

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Type cast the response
                const { data, error } = await SupabaseService.getSession() as {
                    data: { session: Session | null };
                    error: Error | null;
                };

                if (!error && data.session) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Type cast the subscription response and add parameter types
        const { data: { subscription } } = SupabaseService.onAuthStateChange(
            (event: AuthEvent, session: Session | null) => {
                setIsAuthenticated(!!session);
                setIsLoading(false);
            }
        ) as {
            data: { subscription: { unsubscribe: () => void } };
        };

        return () => subscription.unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;