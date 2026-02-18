// src/options/configOptions.ts

import { Mode } from '../types/merchantTypes';

export interface AirXPayConfig {
  publicKey: string;
  environment?: Mode;
  autoRefreshToken?: boolean;
  tokenRefreshThreshold?: number; // milliseconds before expiry
  enableLogging?: boolean;
}

export interface BackendConfig {
  secretKey: string;
  apiUrl: string;
  environment?: Mode;
}

export const DEFAULT_CONFIG: Required<Pick<AirXPayConfig, 'environment' | 'autoRefreshToken' | 'tokenRefreshThreshold' | 'enableLogging'>> = {
  environment: 'test',
  autoRefreshToken: true,
  tokenRefreshThreshold: 60000, // 1 minute
  enableLogging: __DEV__
} as const;

export class ConfigManager {
  private static instance: ConfigManager;
  private frontendConfig: AirXPayConfig | null = null;
  private backendConfig: BackendConfig | null = null;

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  setFrontendConfig(config: AirXPayConfig) {
    this.frontendConfig = {
      ...DEFAULT_CONFIG,
      ...config
    };
  }

  setBackendConfig(config: BackendConfig) {
    this.backendConfig = config;
  }

  getFrontendConfig(): AirXPayConfig | null {
    return this.frontendConfig;
  }

  getBackendConfig(): BackendConfig | null {
    return this.backendConfig;
  }

  getPublicKey(): string {
    if (!this.frontendConfig?.publicKey) {
      throw new Error('AirXPay not initialized. Call initializeInternalApi() first.');
    }
    return this.frontendConfig.publicKey;
  }

  isLoggingEnabled(): boolean {
    return this.frontendConfig?.enableLogging ?? __DEV__;
  }

  log(...args: any[]) {
    if (this.isLoggingEnabled()) {
      console.log('[AirXPay]', ...args);
    }
  }

  error(...args: any[]) {
    if (this.isLoggingEnabled()) {
      console.error('[AirXPay Error]', ...args);
    }
  }
}