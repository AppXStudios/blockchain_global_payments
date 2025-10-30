import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Create Invoice",
      description: "Generate payment link",
      icon: "FileText",
      color: "bg-accent/10 border-accent/20 text-accent",
      action: () => navigate('/invoice-creation')
    },
    {
      title: "Request Payout",
      description: "Withdraw funds",
      icon: "ArrowUpRight",
      color: "bg-success/10 border-success/20 text-success",
      action: () => navigate('/payout-management')
    },
    {
      title: "API Keys",
      description: "Manage integration",
      icon: "Key",
      color: "bg-warning/10 border-warning/20 text-warning",
      action: () => navigate('/api-keys-management')
    },
    {
      title: "View Payments",
      description: "Transaction history",
      icon: "CreditCard",
      color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      action: () => navigate('/payments-management')
    }
  ];

  const handleMoreActions = () => {
    navigate('/merchant-settings');
  };

  return (
    <div className="glassmorphism p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} color="var(--color-accent)" />
      </div>
      <div className="space-y-3">
        {quickActions?.map((action, index) => (
          <button
            key={index}
            onClick={action?.action}
            className="w-full flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-smooth group"
          >
            <div className={`p-2 rounded-lg border ${action?.color}`}>
              <Icon name={action?.icon} size={16} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-foreground group-hover:text-accent transition-smooth">
                {action?.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {action?.description}
              </div>
            </div>
            <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
          </button>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          fullWidth 
          iconName="Plus" 
          iconPosition="left"
          onClick={handleMoreActions}
        >
          More Actions
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsWidget;