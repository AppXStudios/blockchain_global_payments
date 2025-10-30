import React from 'react';


const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'signin', label: 'Sign In', description: 'Access your account' },
    { id: 'signup', label: 'Sign Up', description: 'Create new account' }
  ];

  return (
    <div className="w-full">
      <div className="flex rounded-lg p-1 glassmorphism border border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-accent text-accent-foreground shadow-elevation-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">{tab?.label}</div>
              <div className="text-xs opacity-80 mt-0.5">{tab?.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuthTabs;