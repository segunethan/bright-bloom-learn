import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/lms';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        console.log('No session, clearing user state');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      console.log('Loading profile for user:', user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        console.log('Profile loaded:', profile);
        setCurrentUser(profile);
        setIsAuthenticated(true);
      } else {
        console.log('No profile found, creating new one');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              role: (user.user_metadata?.role as 'student' | 'admin') || 'student'
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else if (newProfile) {
          console.log('New profile created:', newProfile);
          setCurrentUser(newProfile);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        return { error: error.message };
      }

      console.log('Sign in successful');
      return {};
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'admin'): Promise<{ error?: string }> => {
    try {
      // Get the current site URL for email confirmation redirect
      const redirectUrl = `${window.location.origin}/lms/${role}/login`;
      
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
        return { error: error.message };
      }

      // Check if user needs to confirm email
      if (data.user && !data.user.email_confirmed_at) {
        return { 
          error: 'Please check your email and click the confirmation link to complete your registration. You may need to check your spam folder.' 
        };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error?: string }> => {
    if (!currentUser) {
      return { error: 'No user logged in' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        setCurrentUser(data);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      // Determine the correct redirect URL based on current location or email domain
      const currentUrl = window.location.href;
      let redirectUrl;
      
      // If we're on admin login page or the email suggests admin, redirect to admin login
      if (currentUrl.includes('/admin/login') || email.toLowerCase().includes('admin')) {
        redirectUrl = `${window.location.origin}/lms/admin/login`;
      } else {
        // Default to student login
        redirectUrl = `${window.location.origin}/lms/student/login`;
      }
      
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
    currentUser,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };
};
