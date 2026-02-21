// src/index.ts

/**
 * AirXPay SDK - Merchant SDK for Flixora Core
 *
 * Strict separation:
 * - Flixora = Core backend (merchant records, verification)
 * - AirXPay = SDK installed in merchant backend
 */

// ------------------
// Environment Detection
// ------------------
const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

// ------------------
// Core SDK
// ------------------
export { AirXPay } from "./core/in/airxpay";
export {} from "./utils/buffershim"; // Ensure buffer shim is included

export function createAirXPay(options: {
  secretKey: string;
  publicKey: string;
  environment?: "test" | "live";
  enableLogging?: boolean;
}) {
  if (!isNode) {
    throw new Error(
      "❌ createAirXPay can only be used in Node.js backend environment.\n" +
        "This function is for server-side usage only. " +
        "For React Native, use AirXPayProvider and useAirXPay hook instead.",
    );
  }

  // Dynamically import backend-only code to avoid JSX issues
  const {
    createAirXPay: realCreateAirXPay,
  } = require("./constants/createAirXPay");
  return realCreateAirXPay(options);
}

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
  AirXPayOptions,
} from "./types";

// ------------------
// React Native Components (Preserved)
// ------------------
export {
  AirXPayProvider,
  useAirXPay,
  useAirXPaySafe,
  useProviderReady,
} from "./contexts/AirXPayProvider";

export { default as MerchantOnboarding } from "./components/steps/onboarding/MerchantOnboarding";
export { OnboardingCompleteScreen } from "./components/steps/OnboardingComplete";
export { FinalStepScreen } from "./components/steps/onboarding/FinalStepScreen";

// ------------------
// Hooks (Preserved)
// ------------------
export { useMerchantOnboarding } from "./hooks/useMerchantOnboarding";
export { useAirXPaySheet } from "./hooks/useAirXPaySheet";
export { useIsAirXPayReady } from "./dev/airxpay";

// ------------------
// Utilities (Preserved)
// ------------------
export {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "./utils/tokenStorage";

export { decodeJWT, getMerchantIdFromToken, isTokenExpired } from "./utils/jwt";

// Components
export { default as MerchantOnboardingSheet } from "./components/steps/onboarding/MerchantOnboarding";

// Types
export * from "./types";

// Constants
export { API_ENDPOINTS, STORAGE_KEYS, UI_TEXTS } from "./etc/constants";

// Error Handler
export { ErrorHandler } from "./error/errorHandler";
export type { AppError } from "./error/errorHandler";
