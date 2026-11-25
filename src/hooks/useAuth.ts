import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOutUser: () => Promise<void>;
}

/**
 * Custom hook to manage Firebase authentication state and actions.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (authError) => {
        setError(authError.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const signOutUser = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign out');
    }
  };

  return {
    user,
    loading,
    error,
    signOutUser,
  };
}
