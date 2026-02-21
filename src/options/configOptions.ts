// src/options/configOptions.ts

import { Mode, AirXPayConfig as IAirXPayConfig } from '../types/merchantTypes';
import { FlixoraEncrypted } from '../secure';
import { Logger } from '../utils/log/logger';
import { isDev, isNode, safeLog, safeError } from '../config/env';

export interface AirXPayConfig extends IAirXPayConfig {
  environment?: Mode;
  autoRefreshToken?: boolean;
  tokenRefreshThreshold?: number;
  enableLogging?: boolean;
}

export interface BackendConfig {
  secretKey: string;
  clientKey: string;
  environment?: Mode;
}

export const DEFAULT_CONFIG: Required<Pick<AirXPayConfig, 'environment' | 'autoRefreshToken' | 'tokenRefreshThreshold' | 'enableLogging'>> = {
  environment: 'test',
  autoRefreshToken: true,
  tokenRefreshThreshold: 60000,
  enableLogging: isDev
} as const;

export class ConfigManager {
  private static instance: ConfigManager;
  private frontendConfig: AirXPayConfig | null = null;
  private backendConfig: BackendConfig | null = null;
  private vault: FlixoraEncrypted;
  private logger: Logger;
  private loggingEnabled: boolean;

  private constructor() {
    this.loggingEnabled = isDev;
    
    this.vault = FlixoraEncrypted.getInstance({
      enableLogging: this.loggingEnabled,
      namespace: 'airxpay'
    });
    
    this.logger = new Logger({
      enabled: this.loggingEnabled,
      prefix: '[AirXPay Config]'
    });
  }

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
    console.log('[ConfigManager] Setting backend config:', {
      hasSecretKey: !!config.secretKey,
      hasClientKey: !!config.clientKey,
      environment: config.environment
    });
    
    this.backendConfig = config;
    
    // Store keys in vault immediately
    if (config.secretKey) {
      this.vault.storeKey('secretKey', config.secretKey);
    }
    if (config.clientKey) {
      this.vault.storeKey('clientKey', config.clientKey);
    }
  }

  getFrontendConfig(): AirXPayConfig | null {
    return this.frontendConfig;
  }

  getBackendConfig(): BackendConfig | null {
    return this.backendConfig;
  }

  getPublicKey(): string {
    console.log('[ConfigManager] Getting publicKey...');
    
    if (this.vault.hasKey('publicKey')) {
      const key = this.vault.getKey('publicKey');
      console.log('[ConfigManager] PublicKey from vault:', !!key);
      return key;
    }
    
    if (!this.frontendConfig?.publicKey) {
      throw new Error('AirXPay not initialized. Call initializeInternalApi() first.');
    }
    
    console.log('[ConfigManager] PublicKey from frontendConfig');
    return this.frontendConfig.publicKey;
  }

  getSecretKey(): string | undefined {
    console.log('[ConfigManager] Getting secretKey...');
    
    if (this.vault.hasKey('secretKey')) {
      const key = this.vault.getKey('secretKey');
      console.log('[ConfigManager] ✅ SecretKey retrieved from vault');
      return key;
    }
    
    console.log('[ConfigManager] ❌ SecretKey not found in vault');
    console.log('[ConfigManager]    Falling back to backendConfig');
    
    return this.backendConfig?.secretKey;
  }

  getClientKey(): string | undefined {
    console.log('[ConfigManager] Getting clientKey...');
    
    if (this.vault.hasKey('clientKey')) {
      const key = this.vault.getKey('clientKey');
      console.log('[ConfigManager] ✅ ClientKey retrieved from vault');
      return key;
    }
    
    console.log('[ConfigManager] ❌ ClientKey not found in vault');
    console.log('[ConfigManager]    Falling back to backendConfig');
    
    return this.backendConfig?.clientKey;
  }

  hasAllKeys(): boolean {
    return !!(this.getPublicKey() && 
              this.getSecretKey() && 
              this.getClientKey());
  }

  loadKeysFromProcess(): void {
    try {
      const processObj = typeof process !== 'undefined' ? process : 
                        typeof window !== 'undefined' ? (window as any).process : 
                        null;
      
      if (!processObj?.flixora) return;

      const flixoraObj = processObj.flixora;
      
      Object.keys(flixoraObj).forEach((keyName) => {
        const keys = flixoraObj[keyName];
        
        if (keys && typeof keys === 'object') {
          const { publicKey, secretKey, clientKey } = keys;
          
          if (!this.frontendConfig) {
            this.frontendConfig = {} as AirXPayConfig;
          }
          
          if (publicKey) {
            this.frontendConfig.publicKey = publicKey;
            this.vault.storeKey('publicKey', publicKey);
            this.log(`✅ Public key loaded from process.flixora.${keyName}`);
          }
          if (secretKey) {
            this.vault.storeKey('secretKey', secretKey);
            this.frontendConfig.secretKey = secretKey;
            this.log(`✅ Secret key loaded from process.flixora.${keyName}`);
          }
          if (clientKey) {
            this.vault.storeKey('clientKey', clientKey);
            this.frontendConfig.clientKey = clientKey;
            this.log(`✅ Client key loaded from process.flixora.${keyName}`);
          }
        }
      });
      
    } catch (error) {
      this.error('Failed to load keys from process.flixora:', error);
    }
  }

  getVault(): FlixoraEncrypted {
    return this.vault;
  }

  isLoggingEnabled(): boolean {
    return this.frontendConfig?.enableLogging ?? isDev;
  }

  log(...args: any[]) {
    if (this.isLoggingEnabled()) {
      this.logger.info(...args);
    }
  }

  error(...args: any[]) {
    if (this.isLoggingEnabled()) {
      this.logger.error(...args);
    }
  }
}