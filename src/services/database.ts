import { supabase } from '../lib/supabase';
import { type InsertProfile, type Profile } from '../types/supabase';

// Add to existing DatabaseService class
export class DatabaseService {
    // ... existing methods ...

    // Create user profile after signup
    static async createUserProfile(userId: string, email: string): Promise<InsertProfile | null> {
        try {
            const profile: InsertProfile = {
                id: userId,
                email: email,
                full_name: null,
                avatar_url: null,
            };

            const { data, error } = await supabase
                .from('profiles')
                .insert([profile])
                .select()
                .single();

            if (error) {
                console.error('Error creating user profile:', error);
                throw error;
            }

            return data as InsertProfile;
        } catch (error: unknown) {
            console.error('Failed to create user profile:', error);
            return null;
        }
    }

    // Check if user exists (for preventing duplicate signups)
    static async userExists(email: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (error) {
                console.error('Error checking user existence:', error);
                return false;
            }

            return data !== null;
        } catch (error: unknown) {
            console.error('Failed to check user existence:', error);
            return false;
        }
    }

    // Update user preferences after signup
    static async updateUserPreferences(
        userId: string,
        preferences: Record<string, unknown>
    ): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    preferences: preferences,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error updating user preferences:', error);
                return false;
            }

            return true;
        } catch (error: unknown) {
            console.error('Failed to update user preferences:', error);
            return false;
        }
    }
}