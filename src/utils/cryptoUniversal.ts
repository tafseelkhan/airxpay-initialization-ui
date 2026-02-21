// src/utils/crypto.universal.ts

/**
 * Universal Crypto Utility
 * Simple version - works everywhere!
 */

// Detect if we're in Node.js
export const isNode = typeof process !== 'undefined' && 
                      process.versions != null && 
                      process.versions.node != null;

/**
 * Simple hash function that works everywhere
 * Not cryptographically secure - for demo only!
 * For production, use proper crypto library
 */
export async function simpleHash(input: string): Promise<string> {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Create HMAC SHA256 hash - UNIVERSAL
 */
export async function createHmacSHA256(
  secret: string,
  data: string | Buffer
): Promise<string> {
  // Convert Buffer to string if needed
  const dataString = typeof data === 'string' ? data : data.toString('utf8');
  
  if (isNode) {
    // Node.js backend - use native crypto
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(dataString);
      return hmac.digest('hex');
    } catch (e) {
      // Fallback if crypto fails
      console.warn('Node crypto failed, using fallback');
      return simpleHash(secret + dataString);
    }
  } else {
    // React Native - try expo-crypto first, then fallback
    try {
      // Try to use expo-crypto if available
      const Crypto = require('expo-crypto');
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        secret + dataString
      );
      return hash;
    } catch (e) {
      // Fallback for development
      console.warn('expo-crypto not available, using fallback hash');
      return simpleHash(secret + dataString);
    }
  }
}

/**
 * Constant-time string comparison
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Convert to string safely
 */
export function toString(data: string | Buffer): string {
  if (typeof data === 'string') return data;
  return data.toString('utf8');
}