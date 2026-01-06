// Footer component

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sunshine Realtors Group</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for real estate in North India. Find your dream home, investment property, or commercial space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/buy" className="text-gray-400 hover:text-white transition-colors">Buy Property</Link></li>
              <li><Link href="/rent" className="text-gray-400 hover:text-white transition-colors">Rent Property</Link></li>
              <li><Link href="/new-launch" className="text-gray-400 hover:text-white transition-colors">New Launch</Link></li>
              <li><Link href="/commercial" className="text-gray-400 hover:text-white transition-colors">Commercial</Link></li>
              <li><Link href="/plots" className="text-gray-400 hover:text-white transition-colors">Plots & Land</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/insights" className="text-gray-400 hover:text-white transition-colors">Insights</Link></li>
              <li><Link href="/agents" className="text-gray-400 hover:text-white transition-colors">Find Agent</Link></li>
              <li><Link href="/post-property" className="text-gray-400 hover:text-white transition-colors">Post Property</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@sunshinerealtors.com</li>
              <li>Phone: +91-1800-123-4567</li>
              <li>North India Office</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sunshine Realtors Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

