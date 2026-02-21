// src/config/ConfigManager.ts

import { Logger } from '../utils/log/logger';

export interface BackendConfig {
  secretKey: string;
  publicKey: string;
  environment: 'test' | 'live';
}

export class ConfigManager {
  private static instance: ConfigManager;
  private backendConfig: BackendConfig | null = null;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger({
      enabled: true,
      prefix: '[AirXPay Config]'
    });
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  setBackendConfig(config: BackendConfig) {
    // Log only first 8 chars of keys for security
    this.logger.debug('Setting backend config:', {
      secretKey: config.secretKey ? config.secretKey.substring(0, 8) + '...' : undefined,
      publicKey: config.publicKey ? config.publicKey.substring(0, 8) + '...' : undefined,
      environment: config.environment
    });
    
    this.backendConfig = config;
  }

  getBackendConfig(): BackendConfig | null {
    return this.backendConfig;
  }

  getSecretKey(): string {
    if (!this.backendConfig?.secretKey) {
      throw new Error('AirXPay not initialized. Call createAirXPay() first.');
    }
    return this.backendConfig.secretKey;
  }

  getPublicKey(): string {
    if (!this.backendConfig?.publicKey) {
      throw new Error('AirXPay not initialized. Call createAirXPay() first.');
    }
    return this.backendConfig.publicKey;
  }

  getEnvironment(): 'test' | 'live' {
    return this.backendConfig?.environment || 'test';
  }

  log(...args: any[]) {
    this.logger.info(...args);
  }

  error(...args: any[]) {
    this.logger.error(...args);
  }
}