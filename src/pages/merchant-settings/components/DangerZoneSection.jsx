import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DangerZoneSection = ({ onExportData, onDeleteAccount }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [acknowledgeDataLoss, setAcknowledgeDataLoss] = useState(false);
  const [acknowledgeIrreversible, setAcknowledgeIrreversible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const requiredConfirmationText = "DELETE MY ACCOUNT";

  const handleExportData = async () => {
    setIsExporting(true);
    await onExportData();
    setIsExporting(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== requiredConfirmationText || !acknowledgeDataLoss || !acknowledgeIrreversible) {
      return;
    }

    setIsDeleting(true);
    await onDeleteAccount();
    setIsDeleting(false);
  };

  const canDelete = deleteConfirmation === requiredConfirmationText && acknowledgeDataLoss && acknowledgeIrreversible;

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="Download" size={20} color="var(--color-accent)" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Export Account Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download a complete copy of your account data including transactions, settings, and audit logs. 
              This may take a few minutes to prepare.
            </p>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <strong>Included data:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Transaction history and payment records</li>
                  <li>Account settings and configuration</li>
                  <li>API keys and webhook configurations</li>
                  <li>Audit logs and security events</li>
                </ul>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                loading={isExporting}
                iconName="Download"
                iconPosition="left"
              >
                {isExporting ? 'Preparing Export...' : 'Export My Data'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Account Deletion */}
      <div className="glassmorphism p-6 rounded-lg border border-error/30 bg-error/5">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-error mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your merchant account and all associated data. This action cannot be undone.
            </p>
            
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-6 p-4 bg-background/50 rounded-lg border border-error/30">
                <div className="space-y-4">
                  <div className="p-4 bg-error/10 rounded-lg border border-error/30">
                    <h4 className="font-medium text-error mb-2 flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} />
                      <span>Warning: This action is irreversible</span>
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• All payment data and transaction history will be permanently deleted</li>
                      <li>• API keys and webhook configurations will be immediately revoked</li>
                      <li>• Any pending payouts will be cancelled</li>
                      <li>• Your merchant account cannot be recovered after deletion</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <Checkbox
                      label="I understand that all my data will be permanently deleted"
                      checked={acknowledgeDataLoss}
                      onChange={(e) => setAcknowledgeDataLoss(e?.target?.checked)}
                    />
                    <Checkbox
                      label="I understand this action is irreversible and cannot be undone"
                      checked={acknowledgeIrreversible}
                      onChange={(e) => setAcknowledgeIrreversible(e?.target?.checked)}
                    />
                  </div>

                  <div>
                    <Input
                      label={`Type "${requiredConfirmationText}" to confirm`}
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e?.target?.value)}
                      placeholder="Type the confirmation text"
                      error={deleteConfirmation && deleteConfirmation !== requiredConfirmationText ? 'Confirmation text does not match' : ''}
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmation('');
                        setAcknowledgeDataLoss(false);
                        setAcknowledgeIrreversible(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      loading={isDeleting}
                      disabled={!canDelete}
                      iconName="Trash2"
                      iconPosition="left"
                    >
                      {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Additional Information */}
      <div className="glassmorphism p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Need Help?</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you're having issues with your account or considering deletion, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              iconName="MessageCircle"
              iconPosition="left"
            >
              Contact Support
            </Button>
            <Button
              variant="outline"
              iconName="FileText"
              iconPosition="left"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerZoneSection;