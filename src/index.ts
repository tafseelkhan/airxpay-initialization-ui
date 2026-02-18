/**
 * Frontend SDK - Main Entry Point
 * Clean exports with proper separation
 */

// ------------------
// Context / Provider
// ------------------
export { AirXPayProvider } from './contexts/AirXPayProvider';
export {
  useAirXPay,
  useAirXPaySafe,
  useProviderReady
} from './contexts/AirXPayProvider';

// ------------------
// Screens / Components
// ------------------
export { default as MerchantOnboarding } from './components/steps/onboarding/MerchantOnboarding';
export { OnboardingCompleteScreen } from './components/steps/OnboardingComplete';
export { useIsAirXPayReady } from './sdk/airxpay';
export { useAirXPaySheet } from './hooks/useAirXPaySheet'; // Custom hook for onboarding sheet

// ------------------
// HOOKS
// ------------------
export { useMerchantOnboarding } from './hooks/useMerchantOnboarding';  // 👈 ADD KARO

// ------------------
// Types
// ------------------
export type {
  AirXPayConfig,
  Merchant,
  MerchantCreateResponse,
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
} from './types/merchantTypes';

// ------------------
// Utilities
// ------------------
export { getStoredToken, setStoredToken, clearStoredToken } from './utils/tokenStorage';
export { decodeJWT, getMerchantIdFromToken, isTokenExpired } from './utils/jwt';
