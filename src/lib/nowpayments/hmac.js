/**
 * HMAC Verification for NOWPayments IPN Callbacks
 * WHITE-LABEL RULE: This handles both x-bgp-signature and x-nowpayments-sig headers
 * Only server-side usage - never expose to client
 */

import crypto from 'crypto';

// Browser guard
if (typeof window !== 'undefined') {
  throw new Error('HMAC utilities must not run in browser - server-side only!');
}

/**
 * Recursively sort object properties for consistent JSON serialization
 * NOWPayments requires sorted JSON for HMAC verification
 */
function sortObjectProperties(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj?.map(sortObjectProperties);
  }
  
  const sortedObj = {};
  const keys = Object.keys(obj)?.sort();
  
  for (const key of keys) {
    sortedObj[key] = sortObjectProperties(obj?.[key]);
  }
  
  return sortedObj;
}

/**
 * Generate HMAC-SHA512 signature for IPN verification
 * @param {object} payload - The IPN payload object
 * @param {string} secret - The IPN secret from NOWPAYMENTS_IPN_SECRET
 * @returns {string} - Hex-encoded HMAC signature
 */
export function generateIpnSignature(payload, secret) {
  if (!secret) {
    throw new Error('IPN secret is required for signature generation');
  }
  
  // Sort the payload properties
  const sortedPayload = sortObjectProperties(payload);
  
  // Convert to JSON without spaces
  const jsonString = JSON.stringify(sortedPayload, null, 0);
  
  // Generate HMAC-SHA512
  const hmac = crypto?.createHmac('sha512', secret);
  hmac?.update(jsonString, 'utf8');
  
  return hmac?.digest('hex');
}

/**
 * Verify NOWPayments IPN signature
 * Supports both BGP branded header (x-bgp-signature) and legacy NP header (x-nowpayments-sig)
 * @param {object} payload - The IPN payload object  
 * @param {string} signature - The signature from request header
 * @param {string} secret - The IPN secret
 * @returns {boolean} - True if signature is valid
 */
export function verifyIpnSignature(payload, signature, secret) {
  if (!signature || !secret) {
    return false;
  }
  
  try {
    const expectedSignature = generateIpnSignature(payload, secret);
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto?.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    console.error('IPN signature verification failed:', error?.message);
    return false;
  }
}

/**
 * Extract and verify signature from request headers
 * Prioritizes x-bgp-signature but accepts x-nowpayments-sig for compatibility
 * @param {object} headers - Request headers object
 * @param {object} payload - The IPN payload
 * @param {string} secret - The IPN secret
 * @returns {object} - { verified: boolean, signature: string, headerUsed: string }
 */
export function verifyIpnFromHeaders(headers, payload, secret) {
  // Prioritize BGP branded header
  let signature = headers?.['x-bgp-signature'];
  let headerUsed = 'x-bgp-signature';
  
  // Fall back to NOWPayments header for compatibility
  if (!signature) {
    signature = headers?.['x-nowpayments-sig'];
    headerUsed = 'x-nowpayments-sig';
  }
  
  if (!signature) {
    return {
      verified: false,
      signature: null,
      headerUsed: null,
      error: 'No signature header found'
    };
  }
  
  const verified = verifyIpnSignature(payload, signature, secret);
  
  return {
    verified,
    signature,
    headerUsed,
    error: verified ? null : 'Invalid signature'
  };
}

/**
 * Generate API key hash using BGP signing secret
 * Used for secure API key storage and verification
 * @param {string} apiKey - The plain API key
 * @param {string} bgpSecret - BGP_SIGNING_SECRET from environment
 * @returns {string} - Hex-encoded hash
 */
export function hashApiKey(apiKey, bgpSecret) {
  if (!bgpSecret) {
    throw new Error('BGP_SIGNING_SECRET is required for API key hashing');
  }
  
  const hmac = crypto?.createHmac('sha256', bgpSecret);
  hmac?.update(apiKey, 'utf8');
  
  return hmac?.digest('hex');
}

/**
 * Generate secure BGP API key
 * Creates a key in format: bgp_live_<random_base32>
 * @returns {object} - { publicId: string, secret: string, combined: string }
 */
export function generateBgpApiKey() {
  // Generate 32 bytes of random data
  const randomBytes = crypto?.randomBytes(32);
  
  // Convert to base32-like encoding (safe for URLs and headers)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  
  for (let i = 0; i < randomBytes?.length; i++) {
    result += chars?.[randomBytes?.[i] % chars?.length];
  }
  
  const publicId = `bgp_live_${Date.now()}`;
  const secret = result;
  const combined = `${publicId}:${secret}`;
  
  return {
    publicId,
    secret,
    combined
  };
}

/**
 * Verify API key against stored hash
 * @param {string} providedKey - The API key from request header
 * @param {string} storedHash - The hash stored in database
 * @param {string} bgpSecret - BGP_SIGNING_SECRET from environment
 * @returns {boolean} - True if key is valid
 */
export function verifyApiKey(providedKey, storedHash, bgpSecret) {
  try {
    const computedHash = hashApiKey(providedKey, bgpSecret);
    
    return crypto?.timingSafeEqual(
      Buffer.from(computedHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch (error) {
    console.error('API key verification failed:', error?.message);
    return false;
  }
}

/**
 * Status mapping from NOWPayments to BGP
 * Normalizes NP payment statuses to BGP standard statuses
 */
export const STATUS_MAPPING = {
  // NOWPayments status -> BGP status
  'waiting': 'pending',
  'confirming': 'processing', 
  'confirmed': 'processing',
  'sending': 'processing',
  'partially_paid': 'partially_paid',
  'finished': 'completed',
  'failed': 'failed',
  'refunded': 'refunded',
  'expired': 'failed'
};

/**
 * Map NOWPayments status to BGP status
 * @param {string} npStatus - NOWPayments status
 * @returns {string} - BGP standardized status
 */
export function mapNpToBgpStatus(npStatus) {
  return STATUS_MAPPING?.[npStatus] || 'pending';
}

export default {
  generateIpnSignature,
  verifyIpnSignature,
  verifyIpnFromHeaders,
  hashApiKey,
  generateBgpApiKey,
  verifyApiKey,
  mapNpToBgpStatus,
  STATUS_MAPPING
};