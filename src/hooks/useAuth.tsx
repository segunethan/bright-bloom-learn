
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
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
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
        setCurrentUser(profile);
        setIsAuthenticated(true);
      } else {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'admin'): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        return { error: error.message };
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
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
