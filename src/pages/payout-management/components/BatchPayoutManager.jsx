import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BatchPayoutManager = ({ onCreateBatchPayout, onClose }) => {
  const [uploadMethod, setUploadMethod] = useState('csv'); // 'csv' or 'manual'
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [manualPayouts, setManualPayouts] = useState([
    { id: 1, address: '', amount: '', currency: 'btc', label: '' }
  ]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const supportedCurrencies = [
    { value: 'btc', label: 'Bitcoin (BTC)' },
    { value: 'eth', label: 'Ethereum (ETH)' },
    { value: 'usdt', label: 'Tether (USDT)' },
    { value: 'usdc', label: 'USD Coin (USDC)' },
    { value: 'ltc', label: 'Litecoin (LTC)' },
    { value: 'xrp', label: 'Ripple (XRP)' }
  ];

  const csvTemplate = `address,amount,currency,label
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa,0.001,btc,Main Wallet
0x742d35Cc6634C0532925a3b8D4C2C4e4C2C4e4C2,0.1,eth,Exchange Deposit
bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh,0.005,btc,Cold Storage`;

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    if (file?.type !== 'text/csv' && !file?.name?.endsWith('.csv')) {
      setErrors({ file: 'Please upload a valid CSV file' });
      return;
    }

    setCsvFile(file);
    setErrors({});

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e?.target?.result;
        const lines = text?.split('\n')?.filter(line => line?.trim());
        const headers = lines?.[0]?.split(',')?.map(h => h?.trim());
        
        if (!headers?.includes('address') || !headers?.includes('amount') || !headers?.includes('currency')) {
          setErrors({ file: 'CSV must contain address, amount, and currency columns' });
          return;
        }

        const data = lines?.slice(1)?.map((line, index) => {
          const values = line?.split(',')?.map(v => v?.trim());
          const row = {};
          headers?.forEach((header, i) => {
            row[header] = values?.[i] || '';
          });
          row.id = index + 1;
          return row;
        });

        setCsvData(data);
      } catch (error) {
        setErrors({ file: 'Error parsing CSV file' });
      }
    };
    reader?.readAsText(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_payout_template.csv';
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addManualPayout = () => {
    const newId = Math.max(...manualPayouts?.map(p => p?.id)) + 1;
    setManualPayouts([
      ...manualPayouts,
      { id: newId, address: '', amount: '', currency: 'btc', label: '' }
    ]);
  };

  const removeManualPayout = (id) => {
    if (manualPayouts?.length > 1) {
      setManualPayouts(manualPayouts?.filter(p => p?.id !== id));
    }
  };

  const updateManualPayout = (id, field, value) => {
    setManualPayouts(manualPayouts?.map(p => 
      p?.id === id ? { ...p, [field]: value } : p
    ));
  };

  const validatePayouts = (payouts) => {
    const newErrors = {};
    let hasErrors = false;

    payouts?.forEach((payout, index) => {
      const rowErrors = {};

      if (!payout?.address) {
        rowErrors.address = 'Address is required';
        hasErrors = true;
      } else if (payout?.address?.length < 26) {
        rowErrors.address = 'Invalid address format';
        hasErrors = true;
      }

      if (!payout?.amount) {
        rowErrors.amount = 'Amount is required';
        hasErrors = true;
      } else if (parseFloat(payout?.amount) <= 0) {
        rowErrors.amount = 'Amount must be greater than 0';
        hasErrors = true;
      }

      if (!payout?.currency) {
        rowErrors.currency = 'Currency is required';
        hasErrors = true;
      }

      if (Object.keys(rowErrors)?.length > 0) {
        newErrors[`row_${index}`] = rowErrors;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async () => {
    const payouts = uploadMethod === 'csv' ? csvData : manualPayouts;
    
    if (payouts?.length === 0) {
      setErrors({ general: 'Please add at least one payout' });
      return;
    }

    if (!validatePayouts(payouts)) {
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate totals by currency
      const totals = payouts?.reduce((acc, payout) => {
        const currency = payout?.currency;
        acc[currency] = (acc?.[currency] || 0) + parseFloat(payout?.amount);
        return acc;
      }, {});

      await onCreateBatchPayout({
        payouts,
        totals,
        method: uploadMethod
      });
    } catch (error) {
      setErrors({ general: 'Failed to create batch payout' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTotalsByCurrency = () => {
    const payouts = uploadMethod === 'csv' ? csvData : manualPayouts;
    return payouts?.reduce((acc, payout) => {
      if (payout?.amount && payout?.currency) {
        const currency = payout?.currency;
        acc[currency] = (acc?.[currency] || 0) + parseFloat(payout?.amount || 0);
      }
      return acc;
    }, {});
  };

  const totals = getTotalsByCurrency();

  return (
    <div className="glassmorphism rounded-lg border border-border p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Batch Payout Manager</h3>
          <p className="text-sm text-muted-foreground">
            Create multiple payouts at once using CSV upload or manual entry
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
        )}
      </div>
      {/* Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setUploadMethod('csv')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-smooth ${
              uploadMethod === 'csv' ?'border-accent bg-accent/10 text-accent' :'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Upload" size={16} />
            <span>CSV Upload</span>
          </button>
          <button
            onClick={() => setUploadMethod('manual')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-smooth ${
              uploadMethod === 'manual' ?'border-accent bg-accent/10 text-accent' :'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Edit" size={16} />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>
      {/* CSV Upload Method */}
      {uploadMethod === 'csv' && (
        <div className="space-y-6">
          {/* Template Download */}
          <div className="glassmorphism rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1">CSV Template</h4>
                <p className="text-sm text-muted-foreground">
                  Download the template to ensure proper formatting
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                iconName="Download"
              >
                Download Template
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Upload CSV File
            </label>
            <div
              onClick={() => fileInputRef?.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition-smooth"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Icon name="Upload" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">
                {csvFile ? csvFile?.name : 'Click to upload CSV file'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports CSV files with address, amount, currency, and label columns
              </p>
            </div>
            {errors?.file && (
              <p className="mt-2 text-sm text-error">{errors?.file}</p>
            )}
          </div>

          {/* CSV Data Preview */}
          {csvData?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Preview ({csvData?.length} payouts)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-foreground">Address</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-foreground">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-foreground">Currency</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-foreground">Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData?.slice(0, 5)?.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="px-4 py-2 font-mono text-sm text-foreground">
                          {row?.address?.slice(0, 20)}...
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {row?.amount}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground uppercase">
                          {row?.currency}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {row?.label || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData?.length > 5 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    ... and {csvData?.length - 5} more payouts
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Manual Entry Method */}
      {uploadMethod === 'manual' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Manual Payouts</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addManualPayout}
              iconName="Plus"
            >
              Add Payout
            </Button>
          </div>

          {manualPayouts?.map((payout, index) => (
            <div key={payout?.id} className="glassmorphism rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">
                  Payout #{index + 1}
                </span>
                {manualPayouts?.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeManualPayout(payout?.id)}
                    iconName="Trash2"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Destination Address"
                  type="text"
                  value={payout?.address}
                  onChange={(e) => updateManualPayout(payout?.id, 'address', e?.target?.value)}
                  placeholder="Enter wallet address"
                  error={errors?.[`row_${index}`]?.address}
                />

                <Input
                  label="Amount"
                  type="text"
                  value={payout?.amount}
                  onChange={(e) => updateManualPayout(payout?.id, 'amount', e?.target?.value)}
                  placeholder="0.00"
                  error={errors?.[`row_${index}`]?.amount}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <select
                    value={payout?.currency}
                    onChange={(e) => updateManualPayout(payout?.id, 'currency', e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  >
                    {supportedCurrencies?.map(currency => (
                      <option key={currency?.value} value={currency?.value}>
                        {currency?.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Label (Optional)"
                  type="text"
                  value={payout?.label}
                  onChange={(e) => updateManualPayout(payout?.id, 'label', e?.target?.value)}
                  placeholder="e.g., Main Wallet"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Summary */}
      {Object.keys(totals)?.length > 0 && (
        <div className="glassmorphism rounded-lg p-4 border border-border">
          <h4 className="font-medium text-foreground mb-3">Batch Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(totals)?.map(([currency, amount]) => (
              <div key={currency} className="text-center">
                <div className="text-sm text-muted-foreground">
                  {currency?.toUpperCase()}
                </div>
                <div className="font-medium text-foreground">
                  {amount?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Error Message */}
      {errors?.general && (
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-error/10 border border-error/30">
          <Icon name="AlertCircle" size={16} color="var(--color-error)" />
          <span className="text-sm text-error">{errors?.general}</span>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex space-x-3 pt-6 border-t border-border">
        <Button
          onClick={handleSubmit}
          disabled={
            (uploadMethod === 'csv' && csvData?.length === 0) ||
            (uploadMethod === 'manual' && manualPayouts?.every(p => !p?.address || !p?.amount)) ||
            isProcessing
          }
          loading={isProcessing}
          className="gradient-primary text-white"
        >
          Create Batch Payout
        </Button>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default BatchPayoutManager;