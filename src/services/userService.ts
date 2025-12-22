import { supabase } from '../lib/supabase';
import { Profile } from '../types/supabase';

// User profile operations
export class UserService {
    // Fetch user profile with proper typing
    static async getUserProfile(userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return data as Profile;
        } catch (error) {
            console.error('Unexpected error:', error);
            return null;
        }
    }

    // Create or update user profile
    static async upsertUserProfile(profileData: Partial<Profile>): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert(profileData)
                .select()
                .single();

            if (error) {
                console.error('Error upserting profile:', error);
                return null;
            }

            return data as Profile;
        } catch (error) {
            console.error('Unexpected error:', error);
            return null;
        }
    }

    // Update user profile with type-safe updates
    static async updateUserProfile(
        userId: string,
        updates: Partial<Omit<Profile, 'id' | 'created_at'>>
    ): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error updating profile:', error);
                return null;
            }

            return data as Profile;
        } catch (error) {
            console.error('Unexpected error:', error);
            return null;
        }
    }

    // Get current user's session with typing
    static async getCurrentSession() {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error getting session:', error);
            return null;
        }

        return session;
    }
}