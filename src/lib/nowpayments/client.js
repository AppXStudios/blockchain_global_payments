/**
 * NOWPayments API Client - SERVER-SIDE ONLY
 * WHITE-LABEL RULE: This file must NEVER be imported in browser/client code
 * All NP interactions happen server-side behind BGP endpoints
 */

// Browser guard - throw if running in browser
if (typeof window !== 'undefined') {
  throw new Error('NOWPayments client must not run in browser - server-side only!');
}

class NOWPaymentsClient {
  constructor() {
    this.baseURL = 'https://api.nowpayments.io/v1';
    this.apiKey = process.env?.NOWPAYMENTS_API_KEY;
    this.email = process.env?.NOWPAYMENTS_EMAIL;
    this.password = process.env?.NOWPAYMENTS_PASSWORD;
    this.jwtToken = null;
    this.tokenExpiry = null;
    
    if (!this.apiKey) {
      throw new Error('NOWPAYMENTS_API_KEY environment variable is required');
    }
  }

  // Exponential backoff retry for rate limits and server errors
  async retryWithBackoff(fn, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx except 429)
        if (error?.status && error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
          throw error;
        }
        
        // Calculate backoff delay: 1000ms, 2000ms, 4000ms
        const delay = 1000 * Math.pow(2, attempt) + Math.random() * 1000;
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // Make HTTP request to NOWPayments API
  async makeRequest(endpoint, options = {}) {
    return this.retryWithBackoff(async () => {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options?.headers
      };

      // Add JWT token if available and not expired
      if (this.jwtToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        headers['Authorization'] = `Bearer ${this.jwtToken}`;
      }

      const requestOptions = {
        method: options?.method || 'GET',
        headers,
        ...options
      };

      if (options?.body) {
        requestOptions.body = JSON.stringify(options?.body);
      }

      const response = await fetch(url, requestOptions);
      const data = await response?.json()?.catch(() => null);

      if (!response?.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response?.status;
        error.data = data;
        throw error;
      }

      return data;
    });
  }

  // Authenticate and get JWT token (for operations requiring auth)
  async authenticate() {
    if (!this.email || !this.password) {
      // Skip auth if credentials not provided (basic API key auth only)
      return null;
    }

    try {
      const response = await this.makeRequest('/auth', {
        method: 'POST',
        body: {
          email: this.email,
          password: this.password
        }
      });

      this.jwtToken = response?.token;
      // Set expiry to 55 minutes (tokens typically last 1 hour)
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      
      return response;
    } catch (error) {
      console.error('NOWPayments authentication failed:', error?.message);
      return null;
    }
  }

  // PAYMENT OPERATIONS

  // Create payment
  async createPayment(params) {
    const payload = {
      price_amount: params?.priceAmount,
      price_currency: params?.priceCurrency,
      pay_currency: params?.payCurrency,
      ipn_callback_url: params?.ipnCallbackUrl,
      order_id: params?.orderId,
      order_description: params?.orderDescription,
      success_url: params?.successUrl,
      cancel_url: params?.cancelUrl
    };

    return this.makeRequest('/payment', {
      method: 'POST',
      body: payload
    });
  }

  // Create invoice (hosted checkout)
  async createInvoice(params) {
    const payload = {
      price_amount: params?.priceAmount,
      price_currency: params?.priceCurrency,
      order_id: params?.orderId,
      order_description: params?.orderDescription,
      ipn_callback_url: params?.ipnCallbackUrl,
      success_url: params?.successUrl,
      cancel_url: params?.cancelUrl
    };

    return this.makeRequest('/invoice', {
      method: 'POST',
      body: payload
    });
  }

  // Get payment status
  async getPaymentStatus(paymentId) {
    return this.makeRequest(`/payment/${paymentId}`);
  }

  // Get payment estimate
  async getEstimate(params) {
    const query = new URLSearchParams({
      amount: params.amount,
      currency_from: params.currencyFrom,
      currency_to: params.currencyTo
    });

    return this.makeRequest(`/estimate?${query}`);
  }

  // Get minimum payment amount
  async getMinAmount(currencyFrom, currencyTo) {
    const query = new URLSearchParams({
      currency_from: currencyFrom,
      currency_to: currencyTo
    });

    return this.makeRequest(`/min-amount?${query}`);
  }

  // CURRENCY OPERATIONS

  // Get available currencies
  async getCurrencies() {
    return this.makeRequest('/currencies');
  }

  // Get merchant coins (available for merchant)
  async getMerchantCoins() {
    return this.makeRequest('/merchant/coins');
  }

  // PAYOUT OPERATIONS (Requires authentication)

  // Create payout
  async createPayout(params) {
    await this.authenticate(); // Ensure we have JWT token
    
    const payload = {
      withdrawals: [{
        address: params?.address,
        currency: params?.currency,
        amount: params?.amount,
        ipn_callback_url: params?.ipnCallbackUrl
      }]
    };

    return this.makeRequest('/payout', {
      method: 'POST',
      body: payload
    });
  }

  // Verify payout
  async verifyPayout(batchId, verificationCode) {
    await this.authenticate();
    
    return this.makeRequest(`/payout/${batchId}/verify`, {
      method: 'POST',
      body: { verification_code: verificationCode }
    });
  }

  // Get payout status
  async getPayoutStatus(payoutId) {
    return this.makeRequest(`/payout/${payoutId}`);
  }

  // CONVERSION OPERATIONS (Requires authentication)

  // Create conversion
  async createConversion(params) {
    await this.authenticate();
    
    const payload = {
      from_currency: params?.fromCurrency,
      to_currency: params?.toCurrency,
      from_amount: params?.fromAmount
    };

    return this.makeRequest('/exchange', {
      method: 'POST',
      body: payload
    });
  }

  // Get conversion status
  async getConversionStatus(conversionId) {
    return this.makeRequest(`/exchange/${conversionId}`);
  }

  // List conversions
  async listConversions(params = {}) {
    const query = new URLSearchParams();
    if (params?.dateFrom) query?.set('dateFrom', params?.dateFrom);
    if (params?.dateTo) query?.set('dateTo', params?.dateTo);
    if (params?.limit) query?.set('limit', params?.limit);
    if (params?.page) query?.set('page', params?.page);

    const queryString = query?.toString();
    return this.makeRequest(`/exchange${queryString ? `?${queryString}` : ''}`);
  }

  // CUSTODY OPERATIONS (Requires authentication)

  // Create sub-user
  async createCustodyUser(params) {
    await this.authenticate();
    
    const payload = {
      email: params?.email,
      password: params?.password
    };

    return this.makeRequest('/custody/users', {
      method: 'POST',
      body: payload
    });
  }

  // Deposit to custody
  async depositToCustody(params) {
    await this.authenticate();
    
    const payload = {
      user_id: params?.userId,
      currency: params?.currency,
      amount: params?.amount
    };

    return this.makeRequest('/custody/deposit', {
      method: 'POST',
      body: payload
    });
  }

  // Write-off from custody
  async writeOffFromCustody(params) {
    await this.authenticate();
    
    const payload = {
      user_id: params?.userId,
      currency: params?.currency,
      amount: params?.amount
    };

    return this.makeRequest('/custody/writeoff', {
      method: 'POST',
      body: payload
    });
  }
}

// Export singleton instance
const nowPaymentsClient = new NOWPaymentsClient();

export default nowPaymentsClient;

// Helper functions for common operations
export const npPayments = {
  // Create BGP payment with NP backend
  create: (params) => nowPaymentsClient?.createPayment(params),
  
  // Create BGP invoice with NP backend  
  createInvoice: (params) => nowPaymentsClient?.createInvoice(params),
  
  // Get payment status from NP
  getStatus: (paymentId) => nowPaymentsClient?.getPaymentStatus(paymentId),
  
  // Get estimate from NP
  estimate: (params) => nowPaymentsClient?.getEstimate(params),
  
  // Get minimum amount from NP
  minAmount: (from, to) => nowPaymentsClient?.getMinAmount(from, to),
  
  // Get available currencies
  currencies: () => nowPaymentsClient?.getCurrencies()
};

export const npPayouts = {
  // Create payout
  create: (params) => nowPaymentsClient?.createPayout(params),
  
  // Verify payout
  verify: (batchId, code) => nowPaymentsClient?.verifyPayout(batchId, code),
  
  // Get status
  getStatus: (id) => nowPaymentsClient?.getPayoutStatus(id)
};

export const npConversions = {
  // Create conversion
  create: (params) => nowPaymentsClient?.createConversion(params),
  
  // Get status
  getStatus: (id) => nowPaymentsClient?.getConversionStatus(id),
  
  // List conversions
  list: (params) => nowPaymentsClient?.listConversions(params)
};

export const npCustody = {
  // Create user
  createUser: (params) => nowPaymentsClient?.createCustodyUser(params),
  
  // Deposit
  deposit: (params) => nowPaymentsClient?.depositToCustody(params),
  
  // Write-off
  writeOff: (params) => nowPaymentsClient?.writeOffFromCustody(params)
};