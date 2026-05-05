import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to verify session');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const login = useCallback(async (code, state, provider = 'github') => {
    try {
      setLoading(true);
      setError(null);
      
      // Determine the endpoint based on provider
      const endpoint = provider === 'google' 
        ? `${apiUrl}/api/auth/callback/google`
        : `${apiUrl}/api/auth/callback`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshAuth: checkAuthStatus,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
