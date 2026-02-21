// src/index.ts

/**
 * AirXPay SDK - Merchant SDK for Flixora Core
 * 
 * Strict separation:
 * - Flixora = Core backend (merchant records, verification)
 * - AirXPay = SDK installed in merchant backend
 */

// ------------------
// Core SDK
// ------------------
export { AirXPay } from './core/in/airxpay';
export {} from './utils/buffershim'; // Ensure buffer shim is included
// ------------------
// Types
// ------------------
export type {
  // Merchant types
  Merchant,
  MerchantCreateResponse,
  MerchantStatusResponse,
  CreateMerchantPayload,
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
  
  // Event types
  EventMap,
  MerchantOnboardingEventData,
  MerchantOnboardingEventType,
  WebhookPayload,
  AirXPayOptions
} from './types';

// ------------------
// React Native Components (Preserved)
// ------------------
export { 
  AirXPayProvider,
  useAirXPay,
  useAirXPaySafe,
  useProviderReady 
} from './contexts/AirXPayProvider';

export { default as MerchantOnboarding } from './components/steps/onboarding/MerchantOnboarding';
export { OnboardingCompleteScreen } from './components/steps/OnboardingComplete';
export { FinalStepScreen } from './components/steps/onboarding/FinalStepScreen';

// ------------------
// Hooks (Preserved)
// ------------------
export { useMerchantOnboarding } from './hooks/useMerchantOnboarding';
export { useAirXPaySheet } from './hooks/useAirXPaySheet';
export { useIsAirXPayReady } from './dev/airxpay';

// ------------------
// Utilities (Preserved)
// ------------------
export { 
  getStoredToken, 
  setStoredToken, 
  clearStoredToken 
} from './utils/tokenStorage';

export { 
  decodeJWT, 
  getMerchantIdFromToken, 
  isTokenExpired 
} from './utils/jwt';

// Components
export { default as MerchantOnboardingSheet } from './components/steps/onboarding/MerchantOnboarding';

// Types
export * from './types';

// Constants
export { API_ENDPOINTS, STORAGE_KEYS, UI_TEXTS } from './etc/constants';

// Error Handler
export { ErrorHandler } from './error/errorHandler';
export type { AppError } from './error/errorHandler';