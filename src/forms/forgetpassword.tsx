import React, { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SupabaseService } from '../lib/supabase';
import { env } from '../config/env';
import {
    validateEmail,
    validatePasswordStrength,
    validatePasswordMatch,
    getErrorMessage
} from '../utils/validation';
import type { ResetPasswordState } from '../types/auth';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [state, setState] = useState<ResetPasswordState>({
        email: '',
        isLoading: false,
        error: '',
        success: false,
        step: 'request',
        token: undefined,
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (token && type === 'recovery') {
            setState(prev => ({
                ...prev,
                step: 'reset',
                token: token,
            }));
        }
    }, [searchParams]);

    const updateField = useCallback(<K extends keyof ResetPasswordState>(
        field: K,
        value: ResetPasswordState[K]
    ): void => {
        setState(prev => ({
            ...prev,
            [field]: value,
            ...(field !== 'error' ? { error: '' } : {})
        }));
    }, []);

    const handleRequestReset = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        if (!state.email.trim()) {
            updateField('error', 'Email is required');
            return;
        }

        if (!validateEmail(state.email)) {
            updateField('error', 'Please enter a valid email address');
            return;
        }

        updateField('isLoading', true);
        updateField('error', '');
        updateField('success', false);

        try {
            const { error } = await SupabaseService.resetPassword(state.email.trim());

            if (error) {
                throw new Error(error.message);
            }

            updateField('success', true);
            updateField('email', '');

            setTimeout(() => {
                navigate('/signin');
            }, 3000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? getErrorMessage(error)
                : 'Failed to send reset link. Please try again.';

            updateField('error', errorMessage);
            updateField('success', false);
        } finally {
            updateField('isLoading', false);
        }
    };

    const handleResetPassword = async (event: FormEvent): Promise<void> => {
        event.preventDefault();

        if (!state.newPassword || !state.confirmPassword) {
            updateField('error', 'Please fill in all fields');
            return;
        }

        const matchValidation = validatePasswordMatch(
            state.newPassword,
            state.confirmPassword
        );

        if (!matchValidation.match) {
            updateField('error', matchValidation.message);
            return;
        }

        const strengthValidation = validatePasswordStrength(state.newPassword);
        if (!strengthValidation.isValid) {
            updateField('error', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            return;
        }

        updateField('isLoading', true);
        updateField('error', '');

        try {
            const { error } = await SupabaseService.updatePassword(state.newPassword);

            if (error) {
                throw new Error(error.message);
            }

            updateField('step', 'success');
            updateField('newPassword', '');
            updateField('confirmPassword', '');

            setTimeout(() => {
                navigate('/signin');
            }, 3000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? getErrorMessage(error)
                : 'Failed to reset password. Please try again.';

            updateField('error', errorMessage);
        } finally {
            updateField('isLoading', false);
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

    const PasswordMatchIndicator: React.FC = () => {
        if (!state.newPassword || !state.confirmPassword) return null;

        const passwordsMatch = state.newPassword === state.confirmPassword;

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

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700 mb-2">
                        {state.step === 'request' ? 'Reset Password' :
                            state.step === 'reset' ? 'Set New Password' :
                                'Password Updated!'}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {state.step === 'request' ? 'Enter your email to receive a reset link' :
                            state.step === 'reset' ? 'Create a new password for your account' :
                                'Your password has been successfully updated!'}
                    </p>
                </div>

                {state.success && state.step === 'request' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Reset link sent! Check your email and follow the instructions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {state.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{state.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {state.step === 'request' && (
                    <form onSubmit={handleRequestReset}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={state.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateField('email', e.target.value)
                                }
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                                disabled={state.isLoading}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={state.isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors mb-6 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {state.isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                {state.step === 'reset' && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-5">
                            <label htmlFor="newPassword" className="block text-gray-800 font-medium mb-2">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={state.newPassword || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateField('newPassword', e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                                disabled={state.isLoading}
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <PasswordStrengthIndicator password={state.newPassword || ''} />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-gray-800 font-medium mb-2">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={state.confirmPassword || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateField('confirmPassword', e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                                disabled={state.isLoading}
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <PasswordMatchIndicator />
                        </div>

                        <button
                            type="submit"
                            disabled={state.isLoading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors mb-6 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {state.isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : 'Update Password'}
                        </button>
                    </form>
                )}

                {state.step === 'success' && (
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Password Updated Successfully!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                You can now sign in with your new password. Redirecting to login...
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/signin')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors mb-6 shadow-lg hover:shadow-xl"
                        >
                            Go to Sign In
                        </button>
                    </div>
                )}

                {state.step === 'request' && (
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Remember your password? </span>
                        <button
                            onClick={() => navigate('/signin')}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                        >
                            Sign in
                        </button>
                    </div>
                )}

                {state.step === 'reset' && (
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => {
                                updateField('step', 'request');
                                updateField('token', undefined);
                            }}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                        >
                            ← Back to request form
                        </button>
                    </div>
                )}

                {env.isDevelopment && state.token && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                            <p>Token detected: {state.token.substring(0, 20)}...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;