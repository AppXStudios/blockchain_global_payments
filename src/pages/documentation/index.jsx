import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DocumentationSidebar from './components/DocumentationSidebar';
import DocumentationSearch from './components/DocumentationSearch';
import DocumentationContent from './components/DocumentationContent';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('quickstart');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll to top when section changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchResultSelect = (resultId) => {
    setActiveSection(resultId);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Documentation - Blockchain Global Payments</title>
        <meta name="description" content="Comprehensive developer documentation for integrating crypto payments. API reference, webhooks, SDKs, and integration guides." />
        <meta name="keywords" content="crypto payments API, blockchain payments documentation, cryptocurrency integration, payment gateway docs" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 glassmorphism border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="Menu" size={20} color="currentColor" />
              </button>
              <h1 className="font-semibold text-foreground">Documentation</h1>
            </div>
            
            {/* Mobile Search */}
            <div className="flex-1 max-w-xs ml-4">
              <DocumentationSearch onResultSelect={handleSearchResultSelect} />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <DocumentationSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={closeMobileSidebar}
          />

          {/* Main Content */}
          <main className="flex-1 lg:ml-80">
            {/* Desktop Header */}
            <div className="hidden lg:block sticky top-0 z-30 glassmorphism border-b border-border">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-semibold text-foreground">
                    Developer Documentation
                  </h1>
                  <div className="h-6 w-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    API v2.1 • Updated {new Date()?.toLocaleDateString()}
                  </span>
                </div>

                {/* Desktop Search */}
                <DocumentationSearch onResultSelect={handleSearchResultSelect} />
              </div>
            </div>

            {/* Content Area */}
            <DocumentationContent activeSection={activeSection} />

            {/* Footer Navigation */}
            <div className="border-t border-border bg-muted/30">
              <div className="max-w-4xl mx-auto p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Icon name="BookOpen" size={20} color="currentColor" />
                    <span className="text-sm text-muted-foreground">
                      Was this page helpful?
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" iconName="ThumbsUp" iconSize={16}>
                        Yes
                      </Button>
                      <Button variant="ghost" size="sm" iconName="ThumbsDown" iconSize={16}>
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <button className="hover:text-foreground transition-smooth">
                      Edit on GitHub
                    </button>
                    <div className="h-4 w-px bg-border" />
                    <button className="hover:text-foreground transition-smooth">
                      Report Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Quick Actions FAB (Mobile) */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <div className="flex flex-col space-y-3">
            <Button
              variant="default"
              size="icon"
              className="w-12 h-12 rounded-full gradient-primary shadow-elevation-lg"
              iconName="Search"
              iconSize={20}
            />
            <Button
              variant="default"
              size="icon"
              className="w-12 h-12 rounded-full gradient-primary shadow-elevation-lg"
              iconName="MessageCircle"
              iconSize={20}
            />
          </div>
        </div>

        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hidden lg:block fixed bottom-8 right-8 p-3 glassmorphism border border-border rounded-full hover:bg-muted transition-smooth shadow-elevation-md"
        >
          <Icon name="ArrowUp" size={20} color="currentColor" />
        </button>
      </div>
    </>
  );
};

export default Documentation;