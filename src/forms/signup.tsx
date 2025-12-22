import React, { useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseService } from '../lib/supabase';
import { env } from '../config/env';

import {
    validateEmail,
    validatePasswordStrength,
    validatePasswordMatch,
    getErrorMessage
} from '../utils/validation';
import type {
    SignUpFormState,
    SignUpCredentials
} from '../types/supabase';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState<SignUpFormState>({
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        isLoading: false,
        error: '',
        success: false,
    });

    const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

    const updateFormField = useCallback(<K extends keyof SignUpFormState>(
        field: K,
        value: SignUpFormState[K]
    ): void => {
        setFormState(prev => ({
            ...prev,
            [field]: value,
            ...(field !== 'error' ? { error: '' } : {}),
            ...(field === 'password' || field === 'confirmPassword' ? { success: false } : {})
        }));
    }, []);

    const handleSignUp = async (event: FormEvent): Promise<void> => {
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

        const matchValidation = validatePasswordMatch(formState.password, formState.confirmPassword);
        if (!matchValidation.match) {
            updateFormField('error', matchValidation.message);
            return;
        }

        updateFormField('isLoading', true);
        updateFormField('error', '');

        try {
            const credentials: SignUpCredentials = {
                email: formState.email.trim(),
                password: formState.password,
                confirmPassword: formState.confirmPassword
            };

            const { data, error } = await SupabaseService.signUpWithEmail(
                credentials.email,
                credentials.password,
                {
                    signup_method: 'email',
                    signup_date: new Date().toISOString(),
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                // Email confirmation required
                setShowEmailConfirmation(true);
                updateFormField('success', true);
                console.log('Email confirmation required. Check your inbox.');
            } else if (data.session) {
                // Auto-confirmed (development mode)
                updateFormField('success', true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? getErrorMessage(error)
                : 'Failed to create account. Please try again.';

            updateFormField('error', errorMessage);
            updateFormField('success', false);
        } finally {
            updateFormField('isLoading', false);
        }
    };

    const handleGoogleSignUp = async (): Promise<void> => {
        updateFormField('isLoading', true);
        updateFormField('error', '');

        try {
            const { error } = await SupabaseService.signInWithOAuth('google');

            if (error) {
                throw new Error(error.message);
            }
            // OAuth will redirect, so no need to handle further
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to sign up with Google';

            updateFormField('error', errorMessage);
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
                {validation.messages.length > 0 && (
                    <ul className="mt-2 text-xs text-red-600 space-y-1">
                        {validation.messages.map((message: string, index: number) => (
                            <li key={index} className="flex items-center">
                                <span className="mr-1">•</span>
                                {message}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    const PasswordMatchIndicator: React.FC = () => {
        if (!formState.password || !formState.confirmPassword) return null;

        const passwordsMatch = formState.password === formState.confirmPassword;

        return (
            <div className="mt-2">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                </div>
            </div>
        );
    };

    // Email Confirmation Modal
    if (showEmailConfirmation) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Check your email
                        </h2>

                        <p className="text-gray-600 mb-6">
                            We've sent a confirmation link to
                        </p>

                        <p className="text-purple-600 font-semibold mb-6">
                            {formState.email}
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-blue-800">
                                <strong>Next steps:</strong>
                            </p>
                            <ol className="text-sm text-blue-700 mt-2 space-y-2 list-decimal list-inside">
                                <li>Check your email inbox</li>
                                <li>Click the confirmation link</li>
                                <li>Return here to sign in</li>
                            </ol>
                        </div>

                        <button
                            onClick={() => navigate('/signin')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full transition-colors"
                        >
                            Go to Sign In
                        </button>

                        <button
                            onClick={() => setShowEmailConfirmation(false)}
                            className="w-full mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                        >
                            Sign up with different email
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700 mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Sign up to get started with {env.appName}
                    </p>
                </div>

                {formState.success && !showEmailConfirmation && (
                    <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    Account created successfully! Redirecting...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {formState.error && (
                    <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{formState.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSignUp}>
                    <div className="mb-5">
                        <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateFormField('email', e.target.value)
                            }
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                            disabled={formState.isLoading}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-5">
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
                                autoComplete="new-password"
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

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-800 font-medium mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={formState.showConfirmPassword ? 'text' : 'password'}
                                value={formState.confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateFormField('confirmPassword', e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-16 disabled:opacity-50"
                                disabled={formState.isLoading}
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => updateFormField('showConfirmPassword', !formState.showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors disabled:opacity-50"
                                disabled={formState.isLoading}
                                aria-label={formState.showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {formState.showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <PasswordMatchIndicator />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-start">
                            <input
                                type="checkbox"
                                className="mt-1 mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                required
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
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
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="flex items-center mb-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={formState.isLoading}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                            <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                            <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                            <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                            <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Already have an account? </span>
                        <button
                            type="button"
                            onClick={() => navigate('/signin')}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                            disabled={formState.isLoading}
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;