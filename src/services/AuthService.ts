import { supabase } from '../lib/supabase';
import type { ResetPasswordRequest, ResetPasswordResponse, UpdatePasswordRequest, UpdatePasswordResponse, PasswordValidation } from '../types/auth';

export class AuthService {
    // Existing methods (updated signatures to match usage if needed)

    static async sendResetPasswordEmail(email: string): Promise<ResetPasswordResponse> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                return {
                    success: false,
                    message: error.message,
                    requiresEmailVerification: false
                };
            }

            return {
                success: true,
                message: 'Password reset instructions sent to your email',
                requiresEmailVerification: true
            };
        } catch (error) {
            return {
                success: false,
                message: 'An unexpected error occurred',
                requiresEmailVerification: false
            };
        }
    }

    // Alias for compatibility if needed, or remove if unused. 
    // Keeping strict typed version for other consumers.
    static async requestPasswordReset(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
        return this.sendResetPasswordEmail(request.email);
    }

    static async updatePassword(request: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
        try {
            const { error } = await supabase.auth.updateUser({
                password: request.password
            });

            if (error) {
                return {
                    success: false,
                    message: error.message
                };
            }

            return {
                success: true,
                message: 'Password updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: 'An unexpected error occurred'
            };
        }
    }

    // New methods for forgetpassword.tsx

    static async verifyResetToken(token: string): Promise<boolean> {
        // In Supabase PKCE flow, the token might be an access token or a code.
        // If it's a 'recovery' flow, usually the user is signed in when they land.
        // We can check if we have a session.
        const { data: { session } } = await supabase.auth.getSession();
        if (session) return true;

        // If not session, try verifyOtp if it's that kind of token (unlikely for standard link, but possible)
        try {
            // Basic check: if token exists, we might treat it as valid validation pending 
            // actual exchange which happens in updatePasswordWithToken if needed.
            // But usually verifyOtp logs them in.
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'recovery' // or 'magiclink'? 'recovery' is for password reset
            });
            return !error && !!data.session;
        } catch {
            return false;
        }
    }

    static async updatePasswordWithToken(token: string, newPassword: string): Promise<UpdatePasswordResponse> {
        // Assuming the user is already signed in via the token (handled by verifyResetToken or auto-handling)
        // Or we might need to exchange the token here if not done.

        // If verifyResetToken was called and successful, we should have a session.
        // So we just update the password.

        return this.updatePassword({ password: newPassword, confirmPassword: newPassword });
    }

    static validatePasswordStrength(password: string): PasswordValidation {
        const messages: string[] = [];
        let strength: 'weak' | 'medium' | 'strong' = 'weak';

        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                strength = 'strong';
            } else if (/[A-Z]/.test(password) || /[0-9]/.test(password)) {
                strength = 'medium';
            }
        } else {
            messages.push('Password must be at least 8 characters');
        }

        if (strength !== 'strong') {
            if (!/[A-Z]/.test(password)) messages.push('Add an uppercase letter');
            if (!/[0-9]/.test(password)) messages.push('Add a number');
            if (!/[^A-Za-z0-9]/.test(password)) messages.push('Add a special character');
        }

        return {
            isValid: messages.length === 0, // strict validation?
            strength,
            messages
        };
    }

    static validatePasswordMatch(p1: string, p2: string): { match: boolean; message: string } {
        if (p1 === p2) {
            return { match: true, message: '' };
        }
        return { match: false, message: 'Passwords do not match' };
    }
}