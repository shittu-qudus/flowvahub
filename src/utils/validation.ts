export interface PasswordValidation {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    messages: string[];
}

export const validatePasswordStrength = (password: string): PasswordValidation => {
    const messages: string[] = [];

    if (password.length < 8) {
        messages.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        messages.push('Include at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        messages.push('Include at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        messages.push('Include at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        messages.push('Include at least one special character');
    }

    const isValid = messages.length === 0;
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (isValid) {
        strength = password.length >= 12 ? 'strong' : 'medium';
    }

    return { isValid, strength, messages };
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePasswordMatch = (
    password: string,
    confirmPassword: string
): { match: boolean; message: string } => {
    if (password !== confirmPassword) {
        return {
            match: false,
            message: 'Passwords do not match'
        };
    }

    return {
        match: true,
        message: 'Passwords match'
    };
};

export const getErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase();

    if (message.includes('invalid login credentials')) {
        return 'Invalid email or password. Please try again.';
    }

    if (message.includes('email not confirmed')) {
        return 'Please verify your email address before signing in.';
    }

    if (message.includes('user not found')) {
        return 'No account found with this email. Please sign up.';
    }

    if (message.includes('rate limit')) {
        return 'Too many attempts. Please wait a few minutes.';
    }

    if (message.includes('bad request')) {
        return 'Invalid request. Please check your input.';
    }

    if (message.includes('already registered')) {
        return 'Email already registered. Please sign in instead.';
    }

    return error.message || 'An error occurred. Please try again.';
};