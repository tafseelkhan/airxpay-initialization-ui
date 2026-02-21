// src/core/events/types.ts

import { Merchant } from '../../types/merchantTypes';

/**
 * Namespaced event types for merchant onboarding
 * Format: airxpay.[resource].[action].[status]
 */
export type MerchantOnboardingEventType = 
  | 'airxpay.merchant.onboarding.submitted'
  | 'airxpay.merchant.onboarding.pending'
  | 'airxpay.merchant.onboarding.verified'
  | 'airxpay.merchant.onboarding.rejected';

/**
 * Base event structure
 */
export interface BaseEvent<T = any> {
  id: string;           // Unique event ID (for idempotency)
  type: string;         // Event type (namespaced)
  timestamp: number;    // Unix timestamp (ms)
  data: T;              // Event payload
}

/**
 * Merchant onboarding event data
 */
export interface MerchantOnboardingEventData {
  merchantId: string;
  merchantEmail: string;
  merchantName: string;
  businessName?: string;
  mode: 'test' | 'live';
  status: 'submitted' | 'pending' | 'verified' | 'rejected';
  verifiedAt?: number;
  rejectedReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Complete event map for type safety
 */
export interface EventMap {
  'airxpay.merchant.onboarding.submitted': BaseEvent<MerchantOnboardingEventData>;
  'airxpay.merchant.onboarding.pending': BaseEvent<MerchantOnboardingEventData>;
  'airxpay.merchant.onboarding.verified': BaseEvent<MerchantOnboardingEventData>;
  'airxpay.merchant.onboarding.rejected': BaseEvent<MerchantOnboardingEventData>;
}

/**
 * Webhook payload from Flixora
 */
export interface WebhookPayload {
  id: string;           // Webhook event ID (for idempotency)
  type: MerchantOnboardingEventType;
  created: number;      // Unix timestamp
  data: {
    merchant: Merchant;
    previousStatus?: string;
  };
  signature: string;    // HMAC SHA256 signature
}

/**
 * Idempotency record
 */
export interface IdempotencyRecord {
  id: string;
  processedAt: number;
  completed: boolean;
  response?: any;
}