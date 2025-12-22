import React, { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseService } from '../lib/supabase';
import { env } from '../config/env';
import {
    validateEmail,
    validatePasswordStrength,
    getErrorMessage
} from '../utils/validation';
import type {
    LoginFormState,
    LoginCredentials,
    AuthProvider,
    LoginPageProps,
    Session,

} from '../types/supabase';

const LoginPage: React.FC<LoginPageProps> = ({
    redirectPath = '/dashboard',
    onLoginSuccess,
    onLoginError
}) => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState<LoginFormState>({
        email: '',
        password: '',
        showPassword: false,
        isLoading: false,
        error: '',
    });

    useEffect(() => {
        const checkSession = async (): Promise<void> => {
            const { data, error } = await SupabaseService.getSession();

            if (!error && data.session) {
                navigate(redirectPath);
            }
        };

        checkSession();

        const { data: { subscription } } = SupabaseService.onAuthStateChange(
            (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'TOKEN_REFRESHED', session: Session | null) => {
                if (event === 'SIGNED_IN' && session) {
                    navigate(redirectPath);
                    onLoginSuccess?.(session);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate, redirectPath, onLoginSuccess]);

    const updateFormField = useCallback(<K extends keyof LoginFormState>(
        field: K,
        value: LoginFormState[K]
    ): void => {
        setFormState(prev => ({
            ...prev,
            [field]: value,
            ...(field !== 'error' && prev.error ? { error: '' } : {})
        }));
    }, []);

    const handleEmailLogin = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        if (!formState.email.trim()) {
            updateFormField('error', 'Email is required');
            return;
        }

        if (!validateEmail(formState.email)) {
            updateFormField('error', 'Please enter a valid email address');
            return;
        }

        const passwordValidation = validatePasswordStrength(formState.password);
        if (!passwordValidation.isValid) {
            updateFormField('error', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            return;
        }

        updateFormField('isLoading', true);
        updateFormField('error', '');

        try {
            const credentials: LoginCredentials = {
                email: formState.email.trim(),
                password: formState.password
            };

            const { error } = await SupabaseService.signInWithEmail(
                credentials.email,
                credentials.password
            );

            if (error) {
                throw new Error(error.message);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? getErrorMessage(error)
                : 'Failed to sign in. Please try again.';

            updateFormField('error', errorMessage);
            onLoginError?.(error instanceof Error ? error : new Error(errorMessage));

            if (env.isDevelopment) {
                console.error('Login error:', error);
            }
        } finally {
            updateFormField('isLoading', false);
        }
    };

    const handleOAuthLogin = async (provider: AuthProvider): Promise<void> => {
        updateFormField('isLoading', true);
        updateFormField('error', '');

        try {
            // Remove the cast - provider is already AuthProvider type
            const { error } = await SupabaseService.signInWithOAuth(provider);

            if (error) {
                throw new Error(error.message);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : `Failed to sign in with ${provider}`;

            updateFormField('error', errorMessage);
            updateFormField('isLoading', false);
            onLoginError?.(error instanceof Error ? error : new Error(errorMessage));
        }
    };

    // Create a separate handler that calls handleOAuthLogin with the correct provider
    const handleGoogleLogin = async (): Promise<void> => {
        await handleOAuthLogin('google');
    };

    const handleSignUp = async (): Promise<void> => {
        if (!formState.email.trim()) {
            updateFormField('error', 'Email is required');
            return;
        }

        if (!validateEmail(formState.email)) {
            updateFormField('error', 'Please enter a valid email address');
            return;
        }

        const passwordValidation = validatePasswordStrength(formState.password);
        if (!passwordValidation.isValid) {
            updateFormField('error', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            return;
        }

        updateFormField('isLoading', true);
        updateFormField('error', '');

        try {
            const { error } = await SupabaseService.signUpWithEmail(
                formState.email.trim(),
                formState.password,
                {
                    signup_method: 'email',
                    signup_date: new Date().toISOString(),
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            alert('Account created successfully! You can now sign in.');
            updateFormField('email', '');
            updateFormField('password', '');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? getErrorMessage(error)
                : 'Failed to create account. Please try again.';

            updateFormField('error', errorMessage);
        } finally {
            updateFormField('isLoading', false);
        }
    };

    const handlePasswordReset = async (): Promise<void> => {
        if (!formState.email.trim()) {
            updateFormField('error', 'Please enter your email address first');
            return;
        }

        if (!validateEmail(formState.email)) {
            updateFormField('error', 'Please enter a valid email address');
            return;
        }

        updateFormField('isLoading', true);
        updateFormField('error', '');

        try {
            const { error } = await SupabaseService.resetPassword(formState.email.trim());

            if (error) {
                throw new Error(error.message);
            }

            alert('Password reset email sent! Check your inbox.');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to send reset email. Please try again.';

            updateFormField('error', errorMessage);
        } finally {
            updateFormField('isLoading', false);
        }
    };

    const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
        if (!password) return null;

        const validation = validatePasswordStrength(password);
        const strengthPercentage = validation.isValid
            ? validation.strength === 'strong' ? 100 : validation.strength === 'medium' ? 66 : 33
            : Math.min(33, (password.length / 8) * 33);

        const strengthColor = validation.isValid
            ? validation.strength === 'strong' ? 'bg-green-500'
                : validation.strength === 'medium' ? 'bg-yellow-500'
                    : 'bg-red-500'
            : 'bg-red-500';

        return (
            <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${validation.strength === 'strong' ? 'text-green-600' :
                        validation.strength === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {validation.strength.charAt(0).toUpperCase() + validation.strength.slice(1)}
                    </span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${strengthColor}`}
                        style={{ width: `${strengthPercentage}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700 mb-2">
                        Log in to {env.appName}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Log in to receive personalized recommendations
                    </p>
                </div>

                {formState.error && (
                    <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{formState.error}</p>
                    </div>
                )}

                <form onSubmit={handleEmailLogin}>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateFormField('email', e.target.value)
                            }
                            placeholder="user@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                            disabled={formState.isLoading}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={formState.showPassword ? 'text' : 'password'}
                                value={formState.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateFormField('password', e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-16 disabled:opacity-50"
                                disabled={formState.isLoading}
                                required
                                minLength={8}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => updateFormField('showPassword', !formState.showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors disabled:opacity-50"
                                disabled={formState.isLoading}
                                aria-label={formState.showPassword ? 'Hide password' : 'Show password'}
                            >
                                {formState.showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <PasswordStrengthIndicator password={formState.password} />
                    </div>

                    <div className="text-right mb-6">
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors disabled:opacity-50"
                            disabled={formState.isLoading}
                        ><a href='/forget-password'>forgot password?</a>
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={formState.isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors mb-6 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {formState.isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : 'Sign in'}
                    </button>

                    <div className="flex items-center mb-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={formState.isLoading}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                            <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                            <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                            <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                            <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Don't have an account? </span>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors ml-1 disabled:opacity-50"
                            disabled={formState.isLoading}
                        > <a href="/signup">Sign up</a>
                        </button>
                    </div>
                </form>

                {env.isDevelopment && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                            <p>Environment: {env.environment}</p>
                            <p>Auto-confirm: {env.isDevelopment ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;