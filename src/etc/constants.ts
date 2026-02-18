// src/etc/constants.ts

export const API_ENDPOINTS = {
  CREATE_MERCHANT: '/api/merchant/create',
  GET_MERCHANT_STATUS: '/api/merchant/status',
  REFRESH_TOKEN: '/api/merchant/refresh-token',
  VERIFY_PUBLIC_KEY: '/api/merchant/verify-public-key'
} as const;

export const ERROR_MESSAGES = {
  INITIALIZATION_FAILED: 'Failed to initialize AirXPay SDK',
  CREATE_MERCHANT_FAILED: 'Failed to create merchant account',
  FETCH_STATUS_FAILED: 'Failed to fetch merchant status',
  TOKEN_REFRESH_FAILED: 'Failed to refresh authentication token',
  INVALID_PUBLIC_KEY: 'Invalid public key provided',
  NETWORK_ERROR: 'Network connection failed. Please check your internet.'
} as const;

export const UI_TEXTS = {
  ONBOARDING_COMPLETE: {
    TITLE: 'Welcome to AirXPay! 🎉',
    SUBTITLE: 'Your merchant account has been successfully created',
    CONTINUE_BUTTON: 'Continue to Dashboard',
    LOGOUT_BUTTON: 'Logout',
    FOOTER: 'You can now start accepting payments'
  },
  FINAL_STEP: {
    TITLE: 'Complete Registration',
    SUBTITLE: 'Review and submit your merchant details',
    CREATE_BUTTON: 'Create Merchant Account',
    PROCESSING: 'Creating your account...'
  }
} as const;

export const STORAGE_KEYS = {
  MERCHANT_TOKEN: '@airxpay_merchant_token',
  MERCHANT_DATA: '@airxpay_merchant_data'
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 30000,
  UPLOAD: 60000
} as const;