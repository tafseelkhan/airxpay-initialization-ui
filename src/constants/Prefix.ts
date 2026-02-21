// src/constants/index.ts

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'airxpay_access_token',
  REFRESH_TOKEN: 'airxpay_refresh_token',
  TOKEN_EXPIRY: 'airxpay_token_expiry',
} as const;

export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
} as const;

export const LOG_PREFIX = '[AirXPay]';

export const ERROR_MESSAGES = {
  INIT_FAILED: 'Failed to initialize AirXPay SDK',
  INVALID_PUBLIC_KEY: 'Invalid public key provided',
  NO_TOKEN: 'No authentication token found',
  TOKEN_REFRESH_FAILED: 'Failed to refresh authentication token',
  CREATE_MERCHANT_FAILED: 'Failed to create merchant',
  FETCH_STATUS_FAILED: 'Failed to fetch merchant status',
  NETWORK_ERROR: 'Network connection failed',
  VALIDATION_ERROR: 'Validation failed',
} as const;