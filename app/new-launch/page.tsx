// New Launch / Projects Page

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NewLaunchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">New Launch Projects</h1>
          <p className="text-gray-600">
            Discover upcoming and newly launched real estate projects in North India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Projects will be displayed here</p>
          <p className="text-sm text-gray-400 mb-8">
            Connect to projects API to show new launches
          </p>
          <Link href="/projects">
            <Button variant="primary">View All Projects</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}




