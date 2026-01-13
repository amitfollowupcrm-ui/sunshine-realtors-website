// Main Header component

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count for buyers
  useEffect(() => {
    if (user && user.role === 'BUYER') {
      fetch('/api/properties/cart')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.cart) {
            setCartCount(data.cart.length);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Sunshine Realtors</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/buy" className="text-gray-700 hover:text-blue-600 transition-colors">
              Buy
            </Link>
            <Link href="/rent" className="text-gray-700 hover:text-blue-600 transition-colors">
              Rent
            </Link>
            <Link href="/new-launch" className="text-gray-700 hover:text-blue-600 transition-colors">
              New Launch
            </Link>
            <Link href="/commercial" className="text-gray-700 hover:text-blue-600 transition-colors">
              Commercial
            </Link>
            <Link href="/plots" className="text-gray-700 hover:text-blue-600 transition-colors">
              Plots
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition-colors">
              Projects
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {(user.role === 'SELLER' || user.role === 'OWNER' || user.role === 'DEALER') && (
                  <Link href="/post-property">
                    <Button variant="primary" size="md">Post Property</Button>
                  </Link>
                )}
                {user.role === 'BUYER' && (
                  <>
                    <Link href="/favorites" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      <span>🤍</span>
                      <span className="ml-1">Favorites</span>
                    </Link>
                    <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center relative">
                      <span>🛒</span>
                      <span className="ml-1">Cart</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <Link href="/dashboard">
                  <Button variant="outline" size="md">Dashboard</Button>
                </Link>
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Link href="/post-property">
                  <Button variant="primary" size="md">Post Property</Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="md">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="md">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link href="/buy" className="px-2 py-2 text-gray-700 hover:text-blue-600">
                Buy
              </Link>
              <Link href="/rent" className="px-2 py-2 text-gray-700 hover:text-blue-600">
                Rent
              </Link>
              <Link href="/new-launch" className="px-2 py-2 text-gray-700 hover:text-blue-600">
                New Launch
              </Link>
              <Link href="/commercial" className="px-2 py-2 text-gray-700 hover:text-blue-600">
                Commercial
              </Link>
              <Link href="/plots" className="px-2 py-2 text-gray-700 hover:text-blue-600">
                Plots
              </Link>
              <div className="pt-2 border-t space-y-2">
                {(user && (user.role === 'SELLER' || user.role === 'OWNER' || user.role === 'DEALER')) || !user ? (
                  <Link href="/post-property" className="block px-2 py-2 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700">
                    Post Property
                  </Link>
                ) : null}
                {user ? (
                  <>
                    {user.role === 'BUYER' && (
                      <>
                        <Link href="/favorites" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                          🤍 Favorites
                        </Link>
                        <Link href="/cart" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                          🛒 Cart {cartCount > 0 && `(${cartCount})`}
                        </Link>
                      </>
                    )}
                    <Link href="/dashboard" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                      Login
                    </Link>
                    <Link href="/register" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// User Menu Component
const UserMenu: React.FC<{ user: { id: string; email: string; fullName: string; role: string } }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const displayName = user.fullName || user.email.split('@')[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            👤 My Profile
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            📊 Dashboard
          </Link>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};



