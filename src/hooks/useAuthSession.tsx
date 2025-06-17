
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/lms';

export const useAuthSession = () => {
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

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    setCurrentUser
  };
};
