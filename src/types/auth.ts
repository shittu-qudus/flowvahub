export interface ResetPasswordState {
    email: string;
    isLoading: boolean;
    error: string;
    success: boolean;
    step: 'request' | 'reset' | 'success';
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export interface ResetPasswordRequest {
    email: string;
    redirectTo: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    requiresEmailVerification: boolean;
}

export interface UpdatePasswordRequest {
    password: string;
    confirmPassword: string;
}

export interface UpdatePasswordResponse {
    success: boolean;
    message: string;
}

export interface PasswordValidation {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    messages: string[];
}export type AuthProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'apple' | 'azure' | 'gitlab' | 'bitbucket' | 'discord';