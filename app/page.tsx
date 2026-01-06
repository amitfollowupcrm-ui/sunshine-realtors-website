// Homepage

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/property/PropertyCard';

export default async function HomePage() {
  // Fetch featured properties (in a real app, this would be from API)
  // For now, we'll show placeholder data structure

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the best properties in North India
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search by city, locality, or property name"
                  className="flex-1 px-4 py-3 text-gray-900 rounded-lg focus:outline-none"
                />
                <select className="px-4 py-3 text-gray-900 rounded-lg focus:outline-none">
                  <option>Buy</option>
                  <option>Rent</option>
                </select>
                <Link href="/properties/search">
                  <Button variant="primary" size="lg" className="w-full md:w-auto">
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link href="/buy" className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">🏠</div>
              <h3 className="font-semibold">Buy</h3>
              <p className="text-sm text-gray-600">Properties for Sale</p>
            </Link>
            <Link href="/rent" className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">🔑</div>
              <h3 className="font-semibold">Rent</h3>
              <p className="text-sm text-gray-600">Properties for Rent</p>
            </Link>
            <Link href="/new-launch" className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">🏗️</div>
              <h3 className="font-semibold">New Launch</h3>
              <p className="text-sm text-gray-600">Upcoming Projects</p>
            </Link>
            <Link href="/commercial" className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">🏢</div>
              <h3 className="font-semibold">Commercial</h3>
              <p className="text-sm text-gray-600">Commercial Spaces</p>
            </Link>
            <Link href="/plots" className="text-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">📍</div>
              <h3 className="font-semibold">Plots</h3>
              <p className="text-sm text-gray-600">Plots & Land</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-gray-600">Handpicked properties just for you</p>
            </div>
            <Link href="/properties/search?isFeatured=true">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {/* Property Grid - Will be populated with real data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder - In production, fetch from API */}
            <div className="text-center py-12 text-gray-500">
              <p>Properties will be displayed here</p>
              <p className="text-sm mt-2">Connect to API to see featured properties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Properties</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Verified Agents</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to List Your Property?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of property owners and dealers who trust Sunshine Realtors
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg">Post Property Free</Button>
            </Link>
            <Link href="/register?type=dealer">
              <Button variant="outline" size="lg">Become a Dealer</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
