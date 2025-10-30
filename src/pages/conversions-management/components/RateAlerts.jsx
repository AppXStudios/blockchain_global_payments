import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  PlusIcon, 
  X, 
  CheckIcon, 
  TrendingUpIcon,
  TrendingDownIcon 
} from 'lucide-react';

const RateAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    currencyPair: '',
    condition: 'above',
    targetRate: '',
    email: '',
    isActive: true
  });

  // Mock data for demonstration
  useEffect(() => {
    setAlerts([
      {
        id: 1,
        currencyPair: 'BTC/USD',
        condition: 'above',
        targetRate: 45000,
        currentRate: 43200,
        email: 'merchant@bgp.com',
        isActive: true,
        createdAt: new Date()?.toISOString(),
        lastTriggered: null
      },
      {
        id: 2,
        currencyPair: 'ETH/USD',
        condition: 'below',
        targetRate: 2800,
        currentRate: 3100,
        email: 'merchant@bgp.com',
        isActive: true,
        createdAt: new Date()?.toISOString(),
        lastTriggered: null
      }
    ]);
  }, []);

  const currencyPairs = ['BTC/USD', 'ETH/USD', 'USDT/USD', 'LTC/USD', 'BCH/USD'];

  const handleAddAlert = () => {
    if (!newAlert?.currencyPair || !newAlert?.targetRate || !newAlert?.email) {
      return;
    }

    const alert = {
      id: Date.now(),
      ...newAlert,
      targetRate: parseFloat(newAlert?.targetRate),
      currentRate: 0, // Would come from market data
      createdAt: new Date()?.toISOString(),
      lastTriggered: null
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({
      currencyPair: '',
      condition: 'above',
      targetRate: '',
      email: '',
      isActive: true
    });
    setShowAddModal(false);
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleToggleAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, isActive: !alert?.isActive }
        : alert
    ));
  };

  const formatRate = (rate) => {
    return parseFloat(rate)?.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getAlertStatus = (alert) => {
    if (!alert?.isActive) return { status: 'inactive', color: 'gray' };
    
    const { condition, targetRate, currentRate } = alert;
    
    if (condition === 'above' && currentRate >= targetRate) {
      return { status: 'triggered', color: 'green' };
    } else if (condition === 'below' && currentRate <= targetRate) {
      return { status: 'triggered', color: 'green' };
    }
    
    return { status: 'waiting', color: 'blue' };
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Rate Alerts</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get notified when exchange rates hit your target
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Alert
          </button>
        </div>
      </div>
      <div className="p-6">
        {/* Alert List */}
        {alerts?.length > 0 ? (
          <div className="space-y-4">
            {alerts?.map((alert) => {
              const alertStatus = getAlertStatus(alert);
              
              return (
                <div key={alert?.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        alertStatus?.color === 'green' ? 'bg-green-500' :
                        alertStatus?.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="font-medium text-gray-900">
                        {alert?.currencyPair}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        alertStatus?.color === 'green' ? 'bg-green-100 text-green-800' :
                        alertStatus?.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {alertStatus?.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAlert(alert?.id)}
                        className={`p-1.5 rounded transition-colors duration-150 ${
                          alert?.isActive 
                            ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={alert?.isActive ? 'Disable alert' : 'Enable alert'}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert?.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                        title="Delete alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Condition:</span>
                      <div className="flex items-center mt-1">
                        {alert?.condition === 'above' ? (
                          <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className="font-medium">
                          {alert?.condition === 'above' ? 'Above' : 'Below'} ${formatRate(alert?.targetRate)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Rate:</span>
                      <div className="font-medium mt-1">
                        ${formatRate(alert?.currentRate || 0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    <span>Email: {alert?.email}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(alert?.createdAt)?.toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-sm">No rate alerts configured</div>
            <div className="text-gray-400 text-xs mt-1">
              Create alerts to get notified of favorable rates
            </div>
          </div>
        )}
      </div>
      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Rate Alert</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Pair
                </label>
                <select
                  value={newAlert?.currencyPair}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, currencyPair: e?.target?.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a pair</option>
                  {currencyPairs?.map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Condition
                </label>
                <select
                  value={newAlert?.condition}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, condition: e?.target?.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="above">Rate goes above</option>
                  <option value="below">Rate goes below</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newAlert?.targetRate}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetRate: e?.target?.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter target rate"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newAlert?.email}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, email: e?.target?.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAlert}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateAlerts;