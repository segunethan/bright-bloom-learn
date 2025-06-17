
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/lms';

export const useProfileActions = (currentUser: Profile | null, setCurrentUser: (user: Profile) => void) => {
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

  return {
    updateProfile
  };
};
