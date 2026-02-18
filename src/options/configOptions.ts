// src/options/configOptions.ts

import { Mode, AirXPayConfig as IAirXPayConfig } from '../types/merchantTypes';
import { FlixoraEncrypted } from '../secure';

export interface AirXPayConfig extends IAirXPayConfig {
  environment?: Mode;                    // 👈 YEH ADD KARO
  autoRefreshToken?: boolean;             // 👈 YEH ADD KARO
  tokenRefreshThreshold?: number;         // 👈 YEH ADD KARO
  enableLogging?: boolean;                // 👈 Already hai
}

export interface BackendConfig {
  secretKey: string;
  apiUrl: string;
  environment?: Mode;
}

export const DEFAULT_CONFIG: Required<Pick<AirXPayConfig, 'environment' | 'autoRefreshToken' | 'tokenRefreshThreshold' | 'enableLogging'>> = {
  environment: 'test',
  autoRefreshToken: true,
  tokenRefreshThreshold: 60000,
  enableLogging: __DEV__
} as const;

export class ConfigManager {
  private static instance: ConfigManager;
  private frontendConfig: AirXPayConfig | null = null;
  private backendConfig: BackendConfig | null = null;
  private vault: FlixoraEncrypted;

  private constructor() {
    this.vault = FlixoraEncrypted.getInstance({
      enableLogging: __DEV__,
      namespace: 'airxpay'
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
    this.backendConfig = config;
  }

  getFrontendConfig(): AirXPayConfig | null {
    return this.frontendConfig;
  }

  getBackendConfig(): BackendConfig | null {
    return this.backendConfig;
  }

  getPublicKey(): string {
    if (this.vault.hasKey('publicKey')) {
      return this.vault.getKey('publicKey');
    }
    
    if (!this.frontendConfig?.publicKey) {
      throw new Error('AirXPay not initialized. Call initializeInternalApi() first.');
    }
    return this.frontendConfig.publicKey;
  }

  getSecretKey(): string | undefined {
    if (this.vault.hasKey('secretKey')) {
      return this.vault.getKey('secretKey');
    }
    return this.frontendConfig?.secretKey;
  }

  getClientKey(): string | undefined {
    if (this.vault.hasKey('clientKey')) {
      return this.vault.getKey('clientKey');
    }
    return this.frontendConfig?.clientKey;
  }

  hasAllKeys(): boolean {
    return !!(this.getPublicKey() && 
              this.getSecretKey() && 
              this.getClientKey());
  }

  // ✅ FIXED: Developer koi bhi name use kar sakta hai
  loadKeysFromProcess(): void {
    try {
      // Process object check
      const processObj = typeof process !== 'undefined' ? process : 
                        typeof window !== 'undefined' ? (window as any).process : 
                        null;
      
      if (!processObj?.flixora) return;

      // ✅ Developer ne jo bhi name rakha hai, use directly access karo
      const flixoraObj = processObj.flixora;
      
      // Har possible key name check karo
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