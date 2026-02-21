// src/core/webhooks/WebhookHandler.ts

import { IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from '../events/EventEmitter';
import { WebhookVerifier } from './WebhookVerifier';
import { IdempotencyStore } from './IdempotencyStore';
import { EventMap, WebhookPayload } from '../events/types';
import { FlixoraEncrypted } from '../../secure';
import { Logger } from '../../utils/log/logger';

export class WebhookHandler {
  private verifier: WebhookVerifier;
  private idempotency: IdempotencyStore;

  constructor(
    private events: EventEmitter<EventMap>,
    private vault: FlixoraEncrypted,
    private logger: Logger
  ) {
    this.verifier = new WebhookVerifier(logger);
    this.idempotency = new IdempotencyStore(logger);
    this.startCleanupInterval();
  }

  /**
   * Express middleware to verify and dispatch webhooks
   */
  verifyAndDispatch(webhookSecret: string) {
    return async (req: any, res: any) => {
      try {
        const rawBody = req.rawBody || JSON.stringify(req.body);
        const signature = req.headers['x-flixora-signature'] as string;

        if (!signature) {
          this.logger.warn('Webhook received without signature');
          res.statusCode = 401;
          res.end(JSON.stringify({ error: 'Missing signature' }));
          return;
        }

        // ✅ Verify signature (now async)
        const isValid = await this.verifier.verify(
          rawBody,
          signature,
          webhookSecret
        );

        if (!isValid) {
          this.logger.warn('Invalid webhook signature');
          res.statusCode = 401;
          res.end(JSON.stringify({ error: 'Invalid signature' }));
          return;
        }

        const payload: WebhookPayload = typeof req.body === 'string' 
          ? JSON.parse(req.body) 
          : req.body;

        // Check idempotency
        const processed = await this.idempotency.check(payload.id);
        if (processed) {
          this.logger.info('Duplicate webhook received', { id: payload.id });
          res.statusCode = 200;
          res.end(JSON.stringify({ received: true, duplicate: true }));
          return;
        }

        await this.idempotency.set(payload.id);
        this.dispatchWebhookEvent(payload);
        await this.idempotency.complete(payload.id);

        res.statusCode = 200;
        res.end(JSON.stringify({ received: true }));

      } catch (error) {
        this.logger.error('Error processing webhook:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    };
  }

  private dispatchWebhookEvent(payload: WebhookPayload): void {
    const merchant = payload.data.merchant;
    
    const eventData = {
      id: payload.id,
      type: payload.type,
      timestamp: payload.created,
      data: {
        merchantId: merchant.merchantId,
        merchantEmail: merchant.merchantEmail,
        merchantName: merchant.merchantName,
        businessName: merchant.businessName,
        mode: merchant.mode,
        status: this.mapKycStatusToOnboardingStatus(merchant.kycStatus),
        verifiedAt: merchant.kycStatus === 'verified' ? Date.now() : undefined,
        rejectedReason: merchant.kycStatus === 'rejected' ? 'KYC verification failed' : undefined,
        metadata: {
          previousStatus: payload.data.previousStatus,
          ...merchant.metadata
        }
      }
    };

    this.events.emit(payload.type, eventData as any);
  }

  private mapKycStatusToOnboardingStatus(kycStatus: string): string {
    switch (kycStatus) {
      case 'verified': return 'verified';
      case 'rejected': return 'rejected';
      case 'pending': return 'pending';
      default: return 'submitted';
    }
  }

  verifySignature(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Promise<boolean> {
    return this.verifier.verify(payload, signature, secret);
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.idempotency.cleanup();
    }, 60 * 60 * 1000);
  }

  shutdown(): void {
    this.idempotency.clear();
  }
}