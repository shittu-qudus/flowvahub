import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseService } from '../lib/supabase';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the session after OAuth redirect
                const { data, error } = await SupabaseService.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    navigate('/login?error=auth_failed');
                    return;
                }

                if (data.session) {
                    // Successfully authenticated
                    navigate('/dashboard');
                } else {
                    // No session found
                    navigate('/login');
                }
            } catch (error) {
                console.error('Unexpected error in auth callback:', error);
                navigate('/login?error=unexpected');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <p className="text-white text-lg font-medium">Completing sign in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;