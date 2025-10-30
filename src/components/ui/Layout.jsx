import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BackButton from './BackButton';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Check if user is on authenticated dashboard pages
  const isAuthenticatedPage = location?.pathname?.includes('/dashboard') || 
                              location?.pathname?.includes('/payments') || 
                              location?.pathname?.includes('/invoice') || 
                              location?.pathname?.includes('/payout') || 
                              location?.pathname?.includes('/api-keys') || 
                              location?.pathname?.includes('/webhook') || 
                              location?.pathname?.includes('/merchant') ||
                              location?.pathname?.includes('/conversions') ||
                              location?.pathname?.includes('/subscription');
  
  // Don't show header on authentication page
  const isAuthPage = location?.pathname === '/authentication';
  
  // Don't show back button on home page
  const showBackButton = location?.pathname !== '/' && location?.pathname !== '/home';

  if (isAuthenticatedPage) {
    // Dashboard layout with sidebar
    return (
      <div className="flex h-screen bg-background">
        <Sidebar onToggleCollapse={handleToggleCollapse} />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {showBackButton && (
            <div className="p-4">
              <BackButton />
            </div>
          )}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Public layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAuthPage && <Header />}
      <div className="flex-1">
        {showBackButton && !isAuthPage && (
          <div className="p-4">
            <BackButton />
          </div>
        )}
        <main className={isAuthPage ? '' : 'container mx-auto px-6 py-8'}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;