import { supabase } from '../lib/supabase';

// Merchant Settings service for BGP merchant configuration management
export const merchantSettingsService = {
  // Get merchant settings for current user
  async getMerchantSettings() {
    try {
      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.select('*')
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading merchant settings.' } 
      };
    }
  },

  // Update merchant settings
  async updateMerchantSettings(updates) {
    try {
      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating merchant settings.' } 
      };
    }
  },

  // Update business information
  async updateBusinessInfo(businessData) {
    try {
      const updates = {
        business_name: businessData?.businessName,
        business_type: businessData?.businessType,
        website_url: businessData?.websiteUrl,
        business_address: businessData?.businessAddress,
        tax_id: businessData?.taxId
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(updates)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating business information.' } 
      };
    }
  },

  // Update payment settings
  async updatePaymentSettings(paymentData) {
    try {
      const updates = {
        fee_percentage: paymentData?.feePercentage,
        settlement_currency: paymentData?.settlementCurrency,
        settlement_threshold: paymentData?.settlementThreshold,
        auto_settlement: paymentData?.autoSettlement,
        daily_limit: paymentData?.dailyLimit,
        monthly_limit: paymentData?.monthlyLimit
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(updates)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating payment settings.' } 
      };
    }
  },

  // Update webhook settings
  async updateWebhookSettings(webhookData) {
    try {
      const updates = {
        webhook_url: webhookData?.webhookUrl,
        webhook_secret: webhookData?.webhookSecret,
        callback_url: webhookData?.callbackUrl
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(updates)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating webhook settings.' } 
      };
    }
  },

  // Update branding settings
  async updateBrandingSettings(brandingData) {
    try {
      const updates = {
        logo_url: brandingData?.logoUrl,
        brand_colors: brandingData?.brandColors
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(updates)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating branding settings.' } 
      };
    }
  },

  // Update notification preferences
  async updateNotificationSettings(notificationData) {
    try {
      const updates = {
        notification_email: notificationData?.notificationEmail
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(updates)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating notification settings.' } 
      };
    }
  },

  // Update legal page URLs
  async updateLegalSettings(legalData) {
    try {
      const updates = {
        terms_url: legalData?.termsUrl,
        privacy_url: legalData?.privacyUrl
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(updates)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error updating legal settings.' } 
      };
    }
  },

  // Get merchant compliance status
  async getComplianceStatus() {
    try {
      const { data: settings, error } = await this.getMerchantSettings();
      
      if (error) {
        return { data: null, error };
      }

      // Check compliance requirements
      const compliance = {
        business_info_complete: !!(
          settings?.business_name && 
          settings?.business_type && 
          settings?.website_url
        ),
        payment_settings_configured: !!(
          settings?.settlement_currency && 
          settings?.settlement_threshold
        ),
        webhook_configured: !!settings?.webhook_url,
        legal_pages_configured: !!(
          settings?.terms_url && 
          settings?.privacy_url
        ),
        tax_info_provided: !!settings?.tax_id,
        notification_email_set: !!settings?.notification_email,
        branding_configured: !!settings?.logo_url
      };

      const totalChecks = Object.keys(compliance)?.length;
      const completedChecks = Object.values(compliance)?.filter(Boolean)?.length;
      const completionPercentage = (completedChecks / totalChecks) * 100;

      return { 
        data: {
          ...compliance,
          completion_percentage: completionPercentage,
          is_compliant: completionPercentage >= 80 // 80% minimum for compliance
        }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading compliance status.' } 
      };
    }
  },

  // Get merchant analytics settings
  async getAnalyticsSettings() {
    try {
      // Return current analytics and reporting preferences
      const analyticsSettings = {
        reporting_frequency: 'weekly', // daily, weekly, monthly
        include_revenue_reports: true,
        include_transaction_reports: true,
        include_payout_reports: true,
        email_reports: true,
        dashboard_widgets: [
          'revenue_chart',
          'transaction_volume',
          'conversion_rates',
          'pending_payouts',
          'recent_transactions'
        ]
      };

      return { data: analyticsSettings, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error loading analytics settings.' } 
      };
    }
  },

  // Reset merchant settings to defaults
  async resetToDefaults() {
    try {
      const defaultSettings = {
        fee_percentage: 2.5,
        settlement_currency: 'USD',
        settlement_threshold: 100.00,
        auto_settlement: true,
        daily_limit: 10000.00,
        monthly_limit: 100000.00,
        brand_colors: null,
        updated_at: new Date()?.toISOString()
      };

      const { data, error } = await supabase
        ?.from('merchant_settings')
        ?.update(defaultSettings)
        ?.select()
        ?.single();

      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Network error resetting merchant settings.' } 
      };
    }
  }
};

export default merchantSettingsService;