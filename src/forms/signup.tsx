import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { SupabaseService } from '../lib/supabase';
import { env } from '../config/env';

interface SignUpFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

// Yup validation schema
const signupValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain uppercase, lowercase, number, and special character'
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    agreeToTerms: Yup.boolean()
        .oneOf([true], 'You must agree to the Terms of Service and Privacy Policy')
        .required('You must agree to the Terms of Service and Privacy Policy'),
});

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: any): string => {
    const errorMessage = error?.message?.toLowerCase() || '';

    // Network errors
    if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.';
    }

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return 'Network error. Please check your connection and try again.';
    }

    // Sign up specific errors
    if (errorMessage.includes('user already registered') ||
        errorMessage.includes('already been registered')) {
        return 'An account with this email already exists. Please sign in instead.';
    }

    if (errorMessage.includes('invalid email')) {
        return 'Please enter a valid email address.';
    }

    if (errorMessage.includes('password')) {
        return 'Password does not meet requirements. Please check and try again.';
    }

    if (errorMessage.includes('too many requests')) {
        return 'Too many sign up attempts. Please wait a few minutes and try again.';
    }

    // Generic fallback
    return error?.message || 'Failed to create account. Please try again.';
};

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
    const [confirmedEmail, setConfirmedEmail] = useState('');
    const [isOAuthLoading, setIsOAuthLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [globalSuccess, setGlobalSuccess] = useState('');

    const handleSignUp = async (
        values: SignUpFormValues,
        { setSubmitting }: FormikHelpers<SignUpFormValues>
    ): Promise<void> => {
        setGlobalError('');
        setGlobalSuccess('');

        try {
            const { data, error } = await SupabaseService.signUpWithEmail(
                values.email.trim(),
                values.password,
                {
                    signup_method: 'email',
                    signup_date: new Date().toISOString(),
                }
            );

            if (error) {
                throw error;
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                // Email confirmation required
                setConfirmedEmail(values.email);
                setShowEmailConfirmation(true);
            } else if (data.session) {
                // Auto-confirmed (development mode)
                setGlobalSuccess('Account created successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error: any) {
            const errorMessage = getAuthErrorMessage(error);
            setGlobalError(errorMessage);

            if (env.isDevelopment) {
                console.error('Sign up error:', error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleSignUp = async (): Promise<void> => {
        setIsOAuthLoading(true);
        setGlobalError('');

        try {
            const { error } = await SupabaseService.signInWithOAuth('google');

            if (error) {
                throw error;
            }
        } catch (error: any) {
            const errorMessage = getAuthErrorMessage(error);
            setGlobalError(errorMessage);
            setIsOAuthLoading(false);
        }
    };

    const getPasswordStrength = (password: string): { percentage: number; color: string; label: string } => {
        if (!password) return { percentage: 0, color: 'bg-gray-300', label: '' };

        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 12.5;
        if (/[@$!%*?&]/.test(password)) strength += 12.5;

        let color = 'bg-red-500';
        let label = 'Weak';

        if (strength >= 75) {
            color = 'bg-green-500';
            label = 'Strong';
        } else if (strength >= 50) {
            color = 'bg-yellow-500';
            label = 'Medium';
        }

        return { percentage: strength, color, label };
    };

    const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
        if (!password) return null;

        const { percentage, color, label } = getPasswordStrength(password);

        return (
            <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${label === 'Strong' ? 'text-green-600' :
                        label === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {label}
                    </span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${color}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    const PasswordMatchIndicator: React.FC<{ password: string; confirmPassword: string }> = ({
        password,
        confirmPassword
    }) => {
        if (!password || !confirmPassword) return null;

        const passwordsMatch = password === confirmPassword;

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
                            {confirmedEmail}
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

                {globalSuccess && (
                    <div className="mb-5 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-green-700 text-sm">{globalSuccess}</p>
                        </div>
                    </div>
                )}

                {globalError && (
                    <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-700 text-sm">{globalError}</p>
                        </div>
                    </div>
                )}

                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: '',
                        agreeToTerms: false
                    }}
                    validationSchema={signupValidationSchema}
                    onSubmit={handleSignUp}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ values, errors, touched, isSubmitting, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
                                    Email Address
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    disabled={isSubmitting || isOAuthLoading}
                                    autoComplete="email"
                                />
                                {errors.email && touched.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="mb-5">
                                <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Field
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-16 disabled:opacity-50 ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        disabled={isSubmitting || isOAuthLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors disabled:opacity-50"
                                        disabled={isSubmitting || isOAuthLoading}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                                <PasswordStrengthIndicator password={values.password} />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-gray-800 font-medium mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-16 disabled:opacity-50 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        disabled={isSubmitting || isOAuthLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors disabled:opacity-50"
                                        disabled={isSubmitting || isOAuthLoading}
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                                <PasswordMatchIndicator
                                    password={values.password}
                                    confirmPassword={values.confirmPassword}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="flex items-start">
                                    <Field
                                        type="checkbox"
                                        name="agreeToTerms"
                                        className={`mt-1 mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${errors.agreeToTerms && touched.agreeToTerms ? 'border-red-500' : ''
                                            }`}
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
                                {errors.agreeToTerms && touched.agreeToTerms && (
                                    <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isOAuthLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-full transition-colors mb-6 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
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
                                disabled={isSubmitting || isOAuthLoading}
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
                                <a
                                    href="/signin"
                                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                                >
                                    Log In
                                </a>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SignUpPage;