// Search Bar component

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  placeholder = 'Search by city, locality, or property name',
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      // Fetch autocomplete suggestions
      fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.suggestions) {
            setSuggestions(data.data.suggestions.map((s: any) => s.text));
          }
        })
        .catch(() => {
          // Silently fail
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      router.push(`/properties/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button variant="primary" onClick={() => handleSearch()}>
          Search
        </Button>
      </div>
    </div>
  );
};



