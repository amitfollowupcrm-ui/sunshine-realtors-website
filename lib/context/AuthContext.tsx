'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string; refreshToken?: string }>;
  register: (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }) => Promise<{ user: User; token: string; refreshToken?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.authenticated && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('API route returned non-JSON response:', text.substring(0, 200));
      throw new Error('Server error: API endpoint is not working. Please contact support or try again later.');
    }

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = `Login failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken || '');
      
      const expiresInDays = 7;
      const expires = new Date();
      expires.setTime(expires.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
      document.cookie = `auth_token=${data.token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      
      setUser(data.user);
      return { user: data.user, token: data.token, refreshToken: data.refreshToken };
    }
    
    throw new Error(data.error || 'Login failed');
  };

  const register = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('API route returned non-JSON response:', text.substring(0, 200));
      throw new Error('Server error: API endpoint is not working. Please contact support or try again later.');
    }

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = `Registration failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken || '');
      
      const expiresInDays = 7;
      const expires = new Date();
      expires.setTime(expires.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
      document.cookie = `auth_token=${data.token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      
      setUser(data.user);
      return { user: data.user, token: data.token, refreshToken: data.refreshToken };
    }
    
    throw new Error(data.error || 'Registration failed');
  };

  const logout = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
