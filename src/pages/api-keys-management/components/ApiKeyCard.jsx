import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ApiKeyCard = ({ apiKey }) => {
  const navigate = useNavigate();
  const [showKey, setShowKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey?.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy key:', err);
    }
  };

  const handleConfigureWebhooks = () => {
    navigate(`/api-keys-management?key=${apiKey?.id}&tab=webhooks`);
  };

  const handleViewPayments = () => {
    navigate(`/api-keys-management?key=${apiKey?.id}&tab=payments`);
  };

  const handleViewDocs = () => {
    navigate('/documentation');
  };

  const handleViewUsage = () => {
    navigate(`/api-keys-management?key=${apiKey?.id}&tab=usage`);
  };

  const handleEditKey = () => {
    navigate(`/api-keys-management?key=${apiKey?.id}&tab=edit`);
  };

  const handleRegenerateKey = () => {
    setIsRegenerating(true);
    // Simulate regeneration
    setTimeout(() => {
      setIsRegenerating(false);
    }, 2000);
  };

  const handleDeleteKey = () => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      // Handle deletion
      console.log('Deleting key:', apiKey?.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/10';
      case 'revoked':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'inactive':
        return 'Clock';
      case 'revoked':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  const formatUsage = (usage) => {
    if (usage >= 1000000) {
      return `${(usage / 1000000)?.toFixed(1)}M`;
    } else if (usage >= 1000) {
      return `${(usage / 1000)?.toFixed(1)}K`;
    }
    return usage?.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glassmorphism p-6 rounded-xl border border-border hover:border-accent/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <Icon name="Key" size={24} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {apiKey?.name || 'API Key'}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(apiKey?.status)}`}>
                <Icon name={getStatusIcon(apiKey?.status)} size={12} color="currentColor" className="mr-1" />
                {apiKey?.status}
              </span>
              <span className="text-xs text-muted-foreground">
                Created {apiKey?.createdAt}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            title={showKey ? 'Hide key' : 'Show key'}
          >
            <Icon name={showKey ? 'EyeOff' : 'Eye'} size={16} color="currentColor" />
          </button>
        </div>
      </div>
      {/* API Key Display */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30 border border-border">
          <code className="flex-1 text-sm font-mono text-foreground">
            {showKey ? apiKey?.key : `${apiKey?.key?.substring(0, 8)}${'*'?.repeat(24)}`}
          </code>
          <button
            onClick={handleCopyKey}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            title="Copy API key"
          >
            <Icon 
              name={copied ? 'Check' : 'Copy'} 
              size={16} 
              color={copied ? 'var(--color-success)' : 'currentColor'} 
            />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-green-600 mt-1">API key copied to clipboard!</p>
        )}
      </div>
      {/* Usage Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-muted/20">
          <div className="text-lg font-bold text-foreground">
            {formatUsage(apiKey?.usage?.requests || 0)}
          </div>
          <div className="text-xs text-muted-foreground">Requests</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/20">
          <div className="text-lg font-bold text-foreground">
            {apiKey?.usage?.limit ? `${formatUsage(apiKey?.usage?.limit)}` : '∞'}
          </div>
          <div className="text-xs text-muted-foreground">Limit</div>
        </div>
      </div>
      {/* Permissions */}
      {apiKey?.permissions && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Permissions</h4>
          <div className="flex flex-wrap gap-2">
            {apiKey?.permissions?.map((permission, idx) => (
              <span 
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewUsage}
            iconName="BarChart"
            iconPosition="left"
            className="text-xs"
          >
            View Usage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDocs}
            iconName="BookOpen"
            iconPosition="left"
            className="text-xs"
          >
            API Docs
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleConfigureWebhooks}
            iconName="Webhook"
            iconPosition="left"
            className="text-xs"
          >
            Webhooks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewPayments}
            iconName="CreditCard"
            iconPosition="left"
            className="text-xs"
          >
            Payments
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDocs}
              iconName="BookOpen"
            >
              Docs
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewUsage}
              iconName="BarChart3"
            >
              Usage
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditKey}
              iconName="Edit"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerateKey}
              disabled={isRegenerating}
              iconName="RotateCcw"
            >
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteKey}
              iconName="Trash2"
              className="text-error hover:text-error/80"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      {/* Last Used */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last used</span>
          <span>{apiKey?.lastUsed || 'Never'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeyCard;