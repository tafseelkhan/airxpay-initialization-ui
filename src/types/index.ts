// src/types/index.ts

// Re-export all types
export * from './merchantTypes';
export * from './type';

// Re-export types with clean names
export type {
  Merchant,
  CreateMerchantPayload,
  MerchantCreateResponse,
  MerchantStatusResponse,
  BusinessType,
  Mode,
  MerchantStatus,
  KycStatus,
  KYCDetails,
  BankDetails,
  MerchantOnboardingProps,
  StepConfig,
  FormErrors,
  StepCompletion,
  AirXPayConfig,
  FlixoraConfig
} from './merchantTypes';

export type {
  EventMap,
  BaseEvent,
  MerchantOnboardingEventData,
  MerchantOnboardingEventType,
  WebhookPayload,
  IdempotencyRecord,
  AirXPayOptions
} from './type';