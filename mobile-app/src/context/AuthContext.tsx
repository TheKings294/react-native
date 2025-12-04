import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {getAuthToken, clearAuthToken, setAuthToken, getAuthUser, setAuthUser, clearAuthUser,} from '@/lib/authStorage';
import { LoginResponse } from '@/lib/api';

type AuthContextValue = {
  isLoading: boolean;
  token: string | null;
  user: LoginResponse['user'] | null;
  setAuthData: (token: string | null, user?: LoginResponse['user'] | null) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<LoginResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const stored = await getAuthToken();
      const storedUser = await getAuthUser<LoginResponse['user']>();
      if (isMounted) {
        setTokenState(stored);
        setUserState(storedUser);
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const setAuthData = async (nextToken: string | null, nextUser: LoginResponse['user'] | null = null) => {
    if (nextToken) {
      await setAuthToken(nextToken);
    } else {
      await clearAuthToken();
    }

    if (nextUser) {
      await setAuthUser(nextUser);
    } else {
      await clearAuthUser();
    }

    setTokenState(nextToken);
    setUserState(nextUser);
  };

  const logout = async () => {
    await clearAuthToken();
    await clearAuthUser();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, token, user, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
