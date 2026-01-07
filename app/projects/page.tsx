// Projects Listing Page

import React from 'react';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Real Estate Projects</h1>
          <p className="text-gray-600">
            Browse all upcoming and completed real estate projects
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project cards will be displayed here */}
          <div className="text-center py-12 text-gray-500 text-sm">
            Projects will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}



