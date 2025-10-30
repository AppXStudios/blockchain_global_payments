import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const LanguageSelector = ({ languages, activeLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-smooth"
      >
        <Icon name="Code" size={16} color="currentColor" />
        <span className="text-sm font-medium text-foreground">{activeLanguage?.name}</span>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} color="currentColor" />
      </button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-48 glassmorphism border border-border rounded-lg shadow-elevation-lg z-20">
            <div className="p-2">
              {languages?.map((language) => (
                <button
                  key={language?.id}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md text-left transition-smooth ${
                    activeLanguage?.id === language?.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${language?.color}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{language?.name}</div>
                    <div className="text-xs opacity-70">{language?.description}</div>
                  </div>
                  {activeLanguage?.id === language?.id && (
                    <Icon name="Check" size={16} color="currentColor" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;