// React hooks for authentication

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Always try to check auth, even without token (endpoint now returns 200 for unauthenticated)
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
          // Not authenticated or invalid token - clear tokens silently
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        // Only log non-200 responses as errors
        console.error('Auth check failed:', response.status, response.statusText);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      // Network errors - only log actual failures
      console.error('Auth check network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is JSON (API route working) or HTML (route failed)
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
        // If response is not JSON, use default message
        errorMessage = `Login failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.success && data.token) {
      // Store in localStorage for client-side access
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken || '');
      
      // Also set cookie for server-side rendering
      // Cookie expires in 7 days (matching refresh token expiry)
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

    // Check if response is JSON (API route working) or HTML (route failed)
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
        // If response is not JSON, use default message
        errorMessage = `Registration failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data.success && data.token) {
      // Store in localStorage for client-side access
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken || '');
      
      // Also set cookie for server-side rendering
      // Cookie expires in 7 days (matching refresh token expiry)
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
    
    // Also remove cookie
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setUser(null);
    router.push('/');
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}



