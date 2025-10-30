import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const DocumentationSearch = ({ onResultSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Mock search data
  const searchableContent = [
    { id: 'quickstart', title: 'Quickstart Guide', section: 'Getting Started', content: 'Get started with crypto payments in minutes' },
    { id: 'authentication', title: 'Authentication', section: 'Getting Started', content: 'API key authentication and security' },
    { id: 'payments-api', title: 'Payments API', section: 'API Reference', content: 'Create and manage crypto payments' },
    { id: 'webhooks-setup', title: 'Webhook Setup', section: 'Webhooks', content: 'Configure webhook endpoints for real-time notifications' },
    { id: 'react-integration', title: 'React Integration', section: 'Integration Guides', content: 'Integrate crypto payments in React applications' },
    { id: 'api-keys', title: 'API Key Management', section: 'Security', content: 'Secure API key generation and rotation' },
    { id: 'common-errors', title: 'Common Errors', section: 'Troubleshooting', content: 'Resolve common integration issues' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery?.trim()) {
      const filtered = searchableContent?.filter(item =>
        item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.section?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  const handleResultClick = (result) => {
    onResultSelect(result?.id);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text?.split(regex);
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          color="currentColor" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={16} color="currentColor" />
          </button>
        )}
      </div>
      {/* Search Results */}
      {isSearchOpen && searchResults?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glassmorphism border border-border rounded-lg shadow-elevation-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {searchResults?.map((result) => (
              <button
                key={result?.id}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-smooth"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground mb-1">
                      {highlightText(result?.title, searchQuery)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {highlightText(result?.content, searchQuery)}
                    </div>
                    <div className="text-xs text-accent">
                      {result?.section}
                    </div>
                  </div>
                  <Icon name="ArrowUpRight" size={16} color="currentColor" className="ml-2 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* No Results */}
      {isSearchOpen && searchQuery && searchResults?.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glassmorphism border border-border rounded-lg shadow-elevation-lg z-50">
          <div className="p-4 text-center">
            <Icon name="Search" size={24} color="currentColor" className="mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationSearch;