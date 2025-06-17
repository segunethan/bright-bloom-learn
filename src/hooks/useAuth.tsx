
import { useAuthSession } from './useAuthSession';
import { useAuthActions } from './useAuthActions';
import { useProfileActions } from './useProfileActions';

export const useAuth = () => {
  const { currentUser, isAuthenticated, isLoading, setCurrentUser } = useAuthSession();
  const { signIn, signUp, signOut, resetPassword } = useAuthActions(setCurrentUser);
  const { updateProfile } = useProfileActions(currentUser, setCurrentUser);

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
