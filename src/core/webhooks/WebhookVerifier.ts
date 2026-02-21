// src/core/webhooks/WebhookVerifier.ts

import { Logger } from '../../utils/log/logger';
import { createHmacSHA256, constantTimeCompare, toString } from '../../utils/cryptoUniversal';

/**
 * HMAC SHA256 webhook signature verifier
 * Works in both Node.js and React Native!
 */
export class WebhookVerifier {
  constructor(private logger: Logger) {}

  /**
   * Verify webhook signature
   */
  async verify(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Promise<boolean> {
    try {
      // Parse signature header
      const signatures = this.parseSignatureHeader(signature);
      
      if (signatures.length === 0) {
        this.logger.warn('No valid signatures found in header');
        return false;
      }

      // Convert payload to string safely
      const payloadString = toString(payload);

      // Compute expected signature
      const expectedSignature = await createHmacSHA256(secret, payloadString);

      // Compare signatures
      for (const sig of signatures) {
        if (constantTimeCompare(sig, expectedSignature)) {
          this.logger.debug('Signature verified successfully');
          return true;
        }
      }

      this.logger.warn('Signature verification failed');
      return false;

    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Parse signature header
   */
  private parseSignatureHeader(header: string): string[] {
    const signatures: string[] = [];

    header.split(',').forEach(part => {
      const [key, value] = part.trim().split('=');
      if (key === 'v1' && value) {
        signatures.push(value);
      }
    });

    return signatures;
  }
}