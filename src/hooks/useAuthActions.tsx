
import { supabase } from '@/integrations/supabase/client';

export const useAuthActions = (setCurrentUser: (user: any) => void) => {
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Sign in successful for user:', data.user.id);
      }

      return {};
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'admin'): Promise<{ error?: string }> => {
    try {
      // Get the current site URL for email confirmation redirect
      const redirectUrl = `${window.location.origin}/lms`;
      
      console.log('Signing up user with redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Sign up error:', error.message);
        return { error: error.message };
      }

      // Check if user needs to confirm email
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User needs to confirm email');
        return { 
          error: 'Please check your email and click the confirmation link to complete your registration. You may need to check your spam folder.' 
        };
      }

      console.log('Sign up successful');
      return {};
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      // Use the current origin to build the reset password URL
      const redirectUrl = `${window.location.origin}/lms/reset-password`;
      
      console.log('Sending password reset email with redirect URL:', redirectUrl);
      console.log('Reset password for email:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error: error.message };
      }

      console.log('Password reset email sent successfully');
      return {};
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    resetPassword
  };
};
