/**
 * BGP API Route Definitions for NOWPayments Integration
 * These would be implemented as actual API endpoints in a Next.js or Express server
 * WHITE-LABEL: All endpoints are BGP branded, NOWPayments is server-side only
 */

/**
 * API Route Structure for BGP Backend Integration
 * Note: These are route definitions that would be implemented in a backend server
 * For a React-only app, these routes would need to be implemented separately
 */

export const BGP_API_ROUTES = {
  // Payment Operations
  payments: {
    create: 'POST /api/merchant/payments',
    get: 'GET /api/merchant/payments/:id',
    list: 'GET /api/merchant/payments',
    update: 'PUT /api/merchant/payments/:id'
  },

  // Invoice Operations  
  invoices: {
    create: 'POST /api/merchant/invoices',
    get: 'GET /api/merchant/invoices/:id',
    list: 'GET /api/merchant/invoices'
  },

  // Payout Operations
  payouts: {
    create: 'POST /api/merchant/payouts',
    verify: 'POST /api/merchant/payouts/verify',
    get: 'GET /api/merchant/payouts/:id',
    list: 'GET /api/merchant/payouts'
  },

  // Conversion Operations
  conversions: {
    create: 'POST /api/merchant/conversions',
    get: 'GET /api/merchant/conversions/:id',
    list: 'GET /api/merchant/conversions'
  },

  // Custody Operations
  custody: {
    users: 'POST /api/merchant/custody/users',
    deposit: 'POST /api/merchant/custody/deposit',
    writeoff: 'POST /api/merchant/custody/writeoff'
  },

  // NOWPayments IPN Callback (Public)
  webhooks: {
    ipn: 'POST /api/np/ipn'
  },

  // Utility Routes
  utilities: {
    health: 'GET /api/health',
    status: 'GET /api/self/ok',
    estimate: 'POST /api/nowpayments/estimate',
    currencies: 'GET /api/nowpayments/currencies',
    minimumPayouts: 'GET /api/nowpayments/minimum-payouts'
  },

  // File Upload
  upload: {
    merchantLogo: 'POST /api/upload/merchant-logo'
  },

  // Admin (Optional)
  admin: {
    selfTest: 'POST /api/_internal/selftest-payment'
  }
};

/**
 * Sample Implementation Templates for Key Routes
 * These show how the actual API endpoints would be structured
 */

// Example: POST /api/merchant/payments
export const createPaymentTemplate = `
async function createPayment(req, res) {
  try {
    // 1. Authenticate merchant API key
    const { merchant, error: authError } = await authenticateMerchant(req.headers['x-merchant-key']);
    if (authError) return res.status(401).json({ error: authError });

    // 2. Rate limit check
    const rateLimitOk = await checkRateLimit(merchant.id, req.ip);
    if (!rateLimitOk) return res.status(429).json({ error: 'Rate limit exceeded' });

    // 3. Validate request body
    const { amountFiat, currencyFiat, payCurrency, description, successUrl } = req.body;
    
    // 4. Create payment in BGP database
    const bgpPayment = await createBgpPayment({
      merchantId: merchant.id,
      amountFiat,
      currencyFiat,
      payCurrency,
      description,
      successUrl
    });

    // 5. Call NOWPayments API (server-side)
    const npPayment = await nowPaymentsClient.createPayment({
      priceAmount: amountFiat,
      priceCurrency: currencyFiat,
      payCurrency,
      orderId: bgpPayment.payment_id,
      orderDescription: description,
      ipnCallbackUrl: process.env.PLATFORM_URL + '/api/np/ipn',
      successUrl
    });

    // 6. Update BGP payment with NP data
    await updateBgpPayment(bgpPayment.id, {
      external_id: npPayment.payment_id,
      pay_address: npPayment.pay_address,
      amount_crypto: npPayment.pay_amount
    });

    // 7. Return BGP-branded response (no NP data exposed)
    res.json({
      paymentId: bgpPayment.payment_id,
      amount: amountFiat,
      currency: currencyFiat,
      payAddress: npPayment.pay_address,
      checkoutUrl: process.env.PLATFORM_URL + '/checkout/' + bgpPayment.id,
      expiresAt: npPayment.valid_until
    });

  } catch (error) {
    res.status(500).json({ error: 'Payment creation failed' });
  }
}`;

// Example: POST /api/np/ipn
export const ipnHandlerTemplate = `
async function handleIpn(req, res) {
  try {
    // 1. Verify HMAC signature
    const signature = req.headers['x-bgp-signature'] || req.headers['x-nowpayments-sig'];
    const verified = verifyIpnSignature(req.body, signature, process.env.NOWPAYMENTS_IPN_SECRET);

    // 2. Log webhook event
    const webhookLog = await logWebhookEvent({
      type: 'np.ipn',
      signature,
      verified,
      payload: req.body
    });

    if (!verified) {
      return res.status(401).json({ ok: false });
    }

    // 3. Update BGP payment status
    const { payment_id: npPaymentId, payment_status: npStatus } = req.body;
    const bgpStatus = mapNpToBgpStatus(npStatus);
    
    await updatePaymentStatus(npPaymentId, bgpStatus, req.body);

    // 4. Send merchant webhook (if configured)
    await sendMerchantWebhook(npPaymentId, bgpStatus);

    res.json({ ok: true });

  } catch (error) {
    res.status(500).json({ ok: false });
  }
}`;

/**
 * Merchant API Authentication Middleware
 */
export const merchantAuthTemplate = `
async function authenticateMerchant(apiKeyHeader) {
  if (!apiKeyHeader) {
    return { error: 'API key required' };
  }

  // Parse publicId:secret format
  const [publicId, secret] = apiKeyHeader.split(':');
  if (!publicId || !secret) {
    return { error: 'Invalid API key format' };
  }

  // Look up API key in database
  const apiKey = await db.apiKey.findUnique({
    where: { publicId },
    include: { merchant: true }
  });

  if (!apiKey || apiKey.status !== 'active') {
    return { error: 'Invalid API key' };
  }

  // Verify secret hash
  const isValid = verifyApiKey(secret, apiKey.keyHash, process.env.BGP_SIGNING_SECRET);
  if (!isValid) {
    return { error: 'Invalid API key' };
  }

  // Check IP allowlist if configured
  if (apiKey.ipAllowlist.length > 0) {
    const clientIp = getClientIp(req);
    const ipAllowed = apiKey.ipAllowlist.some(ip => isIpInCIDR(clientIp, ip));
    if (!ipAllowed) {
      return { error: 'IP not allowed' };
    }
  }

  // Update last used timestamp
  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  });

  return { merchant: apiKey.merchant };
}`;

/**
 * Rate Limiting Implementation
 */
export const rateLimitTemplate = `
const rateLimitStore = new Map();

async function checkRateLimit(merchantId, clientIp) {
  const key = merchantId + ':' + clientIp;
  const window = parseInt(process.env.RATE_LIMIT_WINDOW || '60'); // seconds
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100');
  
  const now = Date.now();
  const windowStart = now - (window * 1000);
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  
  return true;
}`;

/**
 * BGP Environment Configuration for Backend
 */
export const serverEnvironmentTemplate = `
// Server-side environment variables (Next.js API routes or Express)
const serverConfig = {
  // NOWPayments (never expose to client)
  nowPayments: {
    apiKey: process.env.NOWPAYMENTS_API_KEY,
    email: process.env.NOWPAYMENTS_EMAIL,
    password: process.env.NOWPAYMENTS_PASSWORD,
    ipnSecret: process.env.NOWPAYMENTS_IPN_SECRET,
    jwt: process.env.NOWPAYMENTS_JWT
  },
  
  // BGP Configuration
  bgp: {
    signingSecret: process.env.BGP_SIGNING_SECRET,
    platformUrl: process.env.PLATFORM_URL,
    adminToken: process.env.BGP_ADMIN_TOKEN
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL
  },
  
  // External Services
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    fromAddress: process.env.EMAIL_FROM
  },
  
  storage: {
    blobToken: process.env.BLOB_READ_WRITE_TOKEN
  },
  
  // Rate Limiting
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW || '60'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100')
  }
};

// Validation
function validateServerConfig() {
  const required = [
    'NOWPAYMENTS_API_KEY',
    'NOWPAYMENTS_IPN_SECRET', 
    'BGP_SIGNING_SECRET',
    'DATABASE_URL'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error('Missing required environment variables: ' + missing.join(', '));
  }
}
`;

export default {
  BGP_API_ROUTES,
  createPaymentTemplate,
  ipnHandlerTemplate,
  merchantAuthTemplate,
  rateLimitTemplate,
  serverEnvironmentTemplate
};