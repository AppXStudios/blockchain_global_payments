import React from 'react';
import { Calendar, Clock, DollarSign, Mail, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function UpcomingRenewals({ renewals }) {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedDate = date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
    
    if (diffDays === 0) return `Today (${formattedDate})`;
    if (diffDays === 1) return `Tomorrow (${formattedDate})`;
    if (diffDays < 0) return `Overdue (${formattedDate})`;
    if (diffDays <= 7) return `${diffDays} days (${formattedDate})`;
    
    return formattedDate;
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount || 0);
  };

  // Get urgency indicator
  const getUrgencyIndicator = (dateString) => {
    if (!dateString) return { color: 'gray', urgency: 'unknown' };
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: 'red', urgency: 'overdue' };
    if (diffDays === 0) return { color: 'red', urgency: 'today' };
    if (diffDays === 1) return { color: 'yellow', urgency: 'tomorrow' };
    if (diffDays <= 3) return { color: 'yellow', urgency: 'soon' };
    if (diffDays <= 7) return { color: 'green', urgency: 'upcoming' };
    
    return { color: 'gray', urgency: 'future' };
  };

  // Calculate totals
  const totalRenewalAmount = renewals?.reduce((sum, renewal) => {
    return sum + (renewal?.subscription_plans?.amount || 0);
  }, 0) || 0;

  const overdueRenewals = renewals?.filter(renewal => {
    const date = new Date(renewal?.next_billing_date);
    return date < new Date();
  })?.length || 0;

  const todayRenewals = renewals?.filter(renewal => {
    const date = new Date(renewal?.next_billing_date);
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  })?.length || 0;

  if (!renewals?.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upcoming Renewals</h3>
              <p className="text-sm text-gray-600">Next 7 days</p>
            </div>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming renewals</h3>
          <p className="text-gray-600">All subscription renewals are up to date.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upcoming Renewals</h3>
            <p className="text-sm text-gray-600">Next 7 days</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Total Amount</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {formatCurrency(totalRenewalAmount)}
          </p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">Today</p>
          <p className="text-lg font-bold text-yellow-900 mt-1">
            {todayRenewals}
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm font-medium text-red-800">Overdue</p>
          <p className="text-lg font-bold text-red-900 mt-1">
            {overdueRenewals}
          </p>
        </div>
      </div>

      {/* Renewals List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {renewals?.map((renewal) => {
          const urgency = getUrgencyIndicator(renewal?.next_billing_date);
          
          return (
            <div 
              key={renewal?.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                {/* Urgency Indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    urgency?.color === 'red' ? 'bg-red-500' :
                    urgency?.color === 'yellow' ? 'bg-yellow-500' :
                    urgency?.color === 'green'? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>

                {/* Subscriber Info */}
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {renewal?.subscriber_email}
                    </p>
                    {urgency?.urgency === 'overdue' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-xs text-gray-600">
                      {renewal?.subscription_plans?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {renewal?.subscription_plans?.billing_interval}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Amount */}
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    {formatCurrency(
                      renewal?.subscription_plans?.amount, 
                      renewal?.subscription_plans?.currency || 'USD'
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    {formatDate(renewal?.next_billing_date)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <span className="sr-only">View renewal</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning for overdue renewals */}
      {overdueRenewals > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-red-700">
              {overdueRenewals} subscription{overdueRenewals > 1 ? 's' : ''} {overdueRenewals > 1 ? 'are' : 'is'} overdue for renewal
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 pt-4 border-t flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          Export List
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          Send Reminders
        </Button>
      </div>
    </div>
  );
}