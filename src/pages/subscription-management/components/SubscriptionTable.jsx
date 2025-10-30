import React, { useState } from 'react';
import { 
  MoreVertical, 
  Play, 
  Pause, 
  X, 
  Eye, 
  Calendar,
  Mail,
  DollarSign,
  Clock
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function SubscriptionTable({ subscriptions, onAction, loading }) {
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount || 0);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    return styles?.[status] || styles?.inactive;
  };

  // Get available actions for subscription
  const getAvailableActions = (subscription) => {
    const actions = [];
    
    switch (subscription?.status) {
      case 'active':
        actions?.push(
          { key: 'pause', label: 'Pause', icon: Pause },
          { key: 'cancel', label: 'Cancel', icon: X }
        );
        break;
      case 'paused':
        actions?.push(
          { key: 'resume', label: 'Resume', icon: Play },
          { key: 'cancel', label: 'Cancel', icon: X }
        );
        break;
      default:
        break;
    }

    actions?.push({ key: 'view', label: 'View Details', icon: Eye });
    return actions;
  };

  // Handle action click
  const handleActionClick = (subscription, action) => {
    setShowActionMenu(null);
    
    if (action === 'view') {
      setSelectedSubscription(subscription);
    } else {
      onAction?.(subscription?.id, action);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (!subscriptions?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-600">Start by creating subscription plans and inviting subscribers.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions?.map((subscription) => (
                <tr key={subscription?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription?.subscriber?.full_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription?.subscriber_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription?.subscription_plans?.name || 'Unknown Plan'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription?.subscription_plans?.billing_interval}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(subscription?.status)}`}>
                      {subscription?.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      {formatCurrency(subscription?.billing_amount, subscription?.billing_currency)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDate(subscription?.next_billing_date)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(subscription?.created_at)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowActionMenu(
                          showActionMenu === subscription?.id ? null : subscription?.id
                        )}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {showActionMenu === subscription?.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          <div className="py-1">
                            {getAvailableActions(subscription)?.map((action) => (
                              <button
                                key={action?.key}
                                onClick={() => handleActionClick(subscription, action?.key)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <action.icon className="h-4 w-4 mr-2" />
                                {action?.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Subscription Details Modal */}
      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
              <button
                onClick={() => setSelectedSubscription(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Subscriber Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedSubscription?.subscriber_email}</p>
                    <p className="text-sm"><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedSubscription?.status)}`}>
                        {selectedSubscription?.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Plan:</span> {selectedSubscription?.subscription_plans?.name}</p>
                    <p className="text-sm"><span className="font-medium">Amount:</span> {formatCurrency(selectedSubscription?.billing_amount, selectedSubscription?.billing_currency)}</p>
                    <p className="text-sm"><span className="font-medium">Billing:</span> {selectedSubscription?.subscription_plans?.billing_interval}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Cycle</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Current Period:</span> {formatDate(selectedSubscription?.current_period_start)} - {formatDate(selectedSubscription?.current_period_end)}</p>
                    <p className="text-sm"><span className="font-medium">Next Billing:</span> {formatDate(selectedSubscription?.next_billing_date)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Created:</span> {formatDate(selectedSubscription?.created_at)}</p>
                    {selectedSubscription?.cancelled_at && (
                      <p className="text-sm"><span className="font-medium">Cancelled:</span> {formatDate(selectedSubscription?.cancelled_at)}</p>
                    )}
                    {selectedSubscription?.paused_at && (
                      <p className="text-sm"><span className="font-medium">Paused:</span> {formatDate(selectedSubscription?.paused_at)}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedSubscription?.trial_start && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Trial Period</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Trial Start:</span> {formatDate(selectedSubscription?.trial_start)}</p>
                    <p className="text-sm"><span className="font-medium">Trial End:</span> {formatDate(selectedSubscription?.trial_end)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </>
  );
}