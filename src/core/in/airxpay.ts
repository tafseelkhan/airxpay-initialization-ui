// src/core/AirXPay.ts

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ConfigManager } from '../../config/ConfigManager';
import { Logger } from '../../utils/log/logger';
import { AirXPayOptions, CreateMerchantPayload, MerchantResponse, MerchantStatusResponse } from '../../types/type';

const AIRXPAY_CORE_API = {
  test: 'https://api.test.airxpay.com',
  live: 'https://api.airxpay.com',
} as const;

/**
 * 🚀 AirXPay Backend SDK
 * Internal implementation - NOT exposed to developers directly
 */
export class AirXPay {
  private client: AxiosInstance;
  private config: ConfigManager;
  private logger: Logger;
  private environment: 'test' | 'live';

  constructor(
    private secretKey: string,
    private publicKey: string,
    private options: AirXPayOptions = {}
  ) {
    this.environment = options.mode || 'test';

    console.log('\n🏗️ ===== AIRXPAY BACKEND INITIALIZED =====');
    console.log('🔐 Secret key present:', !!this.secretKey);
    console.log('🔑 Public key present:', !!this.publicKey);
    console.log('🌍 Environment:', this.environment);
    console.log('==========================================\n');

    // Initialize config
    this.config = ConfigManager.getInstance();
    this.config.setBackendConfig({
      secretKey: this.secretKey,
      publicKey: this.publicKey,
      environment: this.environment,
    });

    // Initialize logger
    this.logger = new Logger({
      enabled: options.enableLogging ?? true,
      prefix: '[AirXPay Backend]'
    });

    // Create axios instance with base URL
    const baseURL = AIRXPAY_CORE_API[this.environment];
    
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - AUTOMATICALLY add auth headers
    this.client.interceptors.request.use((config) => {
      // NEVER expose these to developer
      config.headers['Authorization'] = `Bearer ${this.secretKey}`;
      config.headers['X-Public-Key'] = this.publicKey;
      
      this.logger.debug(`🚀 Calling AirXPay Core API: ${config.method?.toUpperCase()} ${config.url}`);
      
      return config;
    });

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`✅ Response: ${response.status}`);
        return response;
      },
      (error: AxiosError) => {
        this.logger.error('❌ API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * ✅ CREATE MERCHANT - Internal implementation
   * Called via airxpay.flixora.createMerchant()
   */
  async createMerchant(payload: CreateMerchantPayload): Promise<MerchantResponse> {
    try {
      this.logger.info('Creating merchant:', { email: payload.merchantEmail });

      const response = await this.client.post('/api/merchant/create', payload);

      this.logger.info('✅ Merchant created:', response.data.merchant.merchantId);

      return {
        success: true,
        merchant: response.data.merchant,
      };
    } catch (error) {
      this.logger.error('❌ Create merchant failed:', error);
      throw error;
    }
  }

  /**
   * ✅ GET MERCHANT STATUS - Internal implementation
   * Called via airxpay.flixora.getMerchantStatus()
   */
  async getMerchantStatus(merchantId: string): Promise<MerchantStatusResponse> {
    try {
      this.logger.info('Fetching merchant status:', { merchantId });

      const response = await this.client.get(`/api/merchant/status/${merchantId}`);

      this.logger.info('✅ Merchant status fetched:', { status: response.data.status });

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      this.logger.error('❌ Fetch merchant status failed:', error);
      throw error;
    }
  }

  /**
   * Format error for consistent response
   */
  private formatError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as any;
      const err = new Error(data.message || data.userMessage || 'AirXPay API error');
      (err as any).statusCode = error.response.status;
      (err as any).data = data;
      return err;
    } else if (error.request) {
      // No response received
      const err = new Error('Network error - no response from AirXPay Core');
      (err as any).statusCode = 503;
      return err;
    } else {
      // Request setup error
      return error;
    }
  }

  /**
   * Shutdown
   */
  shutdown(): void {
    this.logger.info('AirXPay Backend SDK shut down');
  }
}