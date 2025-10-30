import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WebhookPayloadViewer = ({ event, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('request');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const tabs = [
    { id: 'request', label: 'Request Payload', icon: 'Send' },
    { id: 'response', label: 'Response', icon: 'MessageSquare' },
    { id: 'headers', label: 'Headers', icon: 'List' },
    { id: 'verification', label: 'Verification', icon: 'Shield' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glassmorphism border border-border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Webhook Event Details</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span className="font-mono">{event?.id}</span>
                <span>•</span>
                <span>{event?.eventType}</span>
                <span>•</span>
                <span>{new Date(event.timestamp)?.toLocaleString()}</span>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} iconName="X" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-smooth border-b-2 ${
                  activeTab === tab?.id
                    ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'request' && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Request Payload</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(formatJson(event?.payload))}
                    iconName={copied ? "Check" : "Copy"}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-foreground whitespace-pre-wrap">
                    {formatJson(event?.payload)}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'response' && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Response Details</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono ${
                        event?.responseCode >= 200 && event?.responseCode < 300
                          ? 'text-success bg-success/10' :'text-error bg-error/10'
                      }`}>
                        {event?.responseCode || 'No Response'}
                      </span>
                      {event?.responseTime && (
                        <span className="text-xs text-muted-foreground">
                          {event?.responseTime}ms
                        </span>
                      )}
                    </div>
                  </div>

                  {event?.responseBody && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-muted-foreground">Response Body</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(event?.responseBody)}
                          iconName={copied ? "Check" : "Copy"}
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre className="text-foreground whitespace-pre-wrap">
                          {event?.responseBody}
                        </pre>
                      </div>
                    </div>
                  )}

                  {event?.errorMessage && (
                    <div>
                      <label className="text-sm font-medium text-error mb-2 block">Error Message</label>
                      <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                        <p className="text-error text-sm">{event?.errorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'headers' && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Request Headers</h4>
                    <div className="space-y-2">
                      {Object.entries(event?.requestHeaders || {})?.map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded">
                          <span className="font-mono text-sm text-muted-foreground">{key}</span>
                          <span className="font-mono text-sm text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {event?.responseHeaders && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Response Headers</h4>
                      <div className="space-y-2">
                        {Object.entries(event?.responseHeaders)?.map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded">
                            <span className="font-mono text-sm text-muted-foreground">{key}</span>
                            <span className="font-mono text-sm text-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    {event?.verified ? (
                      <>
                        <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                          <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
                        </div>
                        <div>
                          <h4 className="font-medium text-success">Signature Verified</h4>
                          <p className="text-sm text-muted-foreground">HMAC-SHA512 signature is valid</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                        </div>
                        <div>
                          <h4 className="font-medium text-warning">Signature Verification Failed</h4>
                          <p className="text-sm text-muted-foreground">HMAC-SHA512 signature could not be verified</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Signature Header</label>
                      <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
                        <code className="text-foreground break-all">
                          {event?.signature || 'Not provided'}
                        </code>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">Timestamp</label>
                      <div className="bg-muted/30 rounded-lg p-3 font-mono text-sm">
                        <code className="text-foreground">
                          {event?.signatureTimestamp || 'Not provided'}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Verification Details</label>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Algorithm:</span>
                        <span className="text-foreground font-mono">HMAC-SHA512</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payload Size:</span>
                        <span className="text-foreground font-mono">{JSON.stringify(event?.payload)?.length} bytes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verification Time:</span>
                        <span className="text-foreground font-mono">
                          {event?.verificationTime ? `${event?.verificationTime}ms` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Attempt {event?.attempts} of 3</span>
              {event?.nextRetry && (
                <>
                  <span>•</span>
                  <span>Next retry: {new Date(event.nextRetry)?.toLocaleString()}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {event?.status === 'failed' && (
                <Button variant="outline" iconName="RotateCcw">
                  Retry Now
                </Button>
              )}
              <Button variant="default" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebhookPayloadViewer;