import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken, getUser, saveToken, saveUser, clearAuth } from "@/lib/token";
import { stop as stopPlayback } from "@/player/audioEngine";

interface AuthContextValue {
  isAuthenticated: boolean | null;
  username: string | null;
  signIn: (token: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Keeps track of whether the user is logged in and who they are.
// Wrap the whole app in <AuthProvider> once, then call useAuth() anywhere
// to read the current user or to sign in/out.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // On first load, check if we already have a saved token/username from a
  // previous session so the user doesn't have to log in every time.
  useEffect(() => {
    (async () => {
      const [token, user] = await Promise.all([getToken(), getUser()]);
      setUsername(user);
      setIsAuthenticated(!!token);
    })();
  }, []);

  const signIn = async (token: string, user: string) => {
    await Promise.all([saveToken(token), saveUser(user)]);
    setUsername(user);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    // Stop any music that's playing before wiping the session.
    stopPlayback();
    await clearAuth();
    setUsername(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextValue = { isAuthenticated, username, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
