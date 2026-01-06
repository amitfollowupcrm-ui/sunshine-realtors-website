// Main Header component

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/login">
              <Button variant="ghost" size="md">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md">Register</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="md">Dashboard</Button>
            </Link>
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
                <Link href="/login" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="block px-2 py-2 text-gray-700 hover:text-blue-600">
                  Register
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

