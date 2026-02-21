// src/utils/env.ts

/**
 * Environment detection utility
 * Works in both React Native and Node.js
 */

// Check if we're in Node.js backend
export const isNode = typeof process !== 'undefined' && 
                     process.versions != null && 
                     process.versions.node != null;

// Check if we're in browser/React Native
export const isBrowser = typeof window !== 'undefined' || 
                        typeof navigator !== 'undefined';

// Safe __DEV__ check that works everywhere
export const isDev = (() => {
  // React Native's __DEV__
  if (typeof __DEV__ !== 'undefined') {
    return __DEV__;
  }
  // Node.js environment
  if (isNode) {
    return process.env.NODE_ENV !== 'production';
  }
  // Default to false
  return false;
})();

// Safe logging function
export const safeLog = (enabled: boolean, ...args: any[]) => {
  if (enabled && isDev) {
    console.log('[AirXPay]', ...args);
  }
};

export const safeError = (enabled: boolean, ...args: any[]) => {
  if (enabled && isDev) {
    console.error('[AirXPay Error]', ...args);
  }
};