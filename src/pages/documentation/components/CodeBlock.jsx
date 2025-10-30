import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CodeBlock = ({ code, language = 'javascript', title, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatCode = (code) => {
    // Simple syntax highlighting for demonstration
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'async', 'await', 'try', 'catch'];
    const strings = /(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    
    let formattedCode = code;
    
    // Highlight strings
    formattedCode = formattedCode?.replace(strings, '<span class="text-green-400">$1$2$3</span>');
    
    // Highlight comments
    formattedCode = formattedCode?.replace(comments, '<span class="text-gray-500">$1</span>');
    
    // Highlight keywords
    keywords?.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      formattedCode = formattedCode?.replace(regex, `<span class="text-violet-400">${keyword}</span>`);
    });
    
    return formattedCode;
  };

  const lines = code?.split('\n');

  return (
    <div className="glassmorphism border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Icon name="Code" size={16} color="currentColor" />
          {title && <span className="text-sm font-medium text-foreground">{title}</span>}
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          iconName={copied ? "Check" : "Copy"}
          iconSize={16}
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm font-mono bg-background/50">
          <code className="text-foreground">
            {showLineNumbers ? (
              <div className="flex">
                {/* Line Numbers */}
                <div className="flex flex-col text-muted-foreground select-none mr-4 text-right min-w-[2rem]">
                  {lines?.map((_, index) => (
                    <span key={index} className="leading-6">
                      {index + 1}
                    </span>
                  ))}
                </div>
                
                {/* Code Lines */}
                <div className="flex-1">
                  {lines?.map((line, index) => (
                    <div key={index} className="leading-6" dangerouslySetInnerHTML={{ __html: formatCode(line) || '&nbsp;' }} />
                  ))}
                </div>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatCode(code) }} />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;