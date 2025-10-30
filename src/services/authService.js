import { supabase } from '../lib/supabase';

// Authentication service for Supabase integration
export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            role: userData?.role || 'merchant'
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection.' } 
      };
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error. Please check your connection.' } 
      };
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      return { error };
    } catch (error) {
      return { error: { message: 'Network error during sign out.' } };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase?.auth?.getSession();
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to get session.' } 
      };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      return { user, error };
    } catch (error) {
      return { 
        user: null, 
        error: { message: 'Failed to get user data.' } 
      };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window?.location?.origin}/reset-password`
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to send reset email.' } 
      };
    }
  },

  // Update password
  async updatePassword(password) {
    try {
      const { data, error } = await supabase?.auth?.updateUser({
        password
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to update password.' } 
      };
    }
  },

  // Send magic link
  async sendMagicLink(email) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window?.location?.origin}/dashboard-overview`
        }
      });
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Failed to send magic link.' } 
      };
    }
  }
};

export default authService;