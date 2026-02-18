// src/schema/validators.ts

import { CreateMerchantPayload } from '../types/merchantTypes';

export interface ValidationError {
  field: string;
  message: string;
}

export class PayloadValidator {
  static validateCreateMerchant(payload: CreateMerchantPayload): ValidationError[] {
    const errors: ValidationError[] = [];

    // Merchant Name validation
    if (!payload.merchantName?.trim()) {
      errors.push({ field: 'merchantName', message: 'Merchant name is required' });
    } else if (payload.merchantName.length < 2) {
      errors.push({ field: 'merchantName', message: 'Name must be at least 2 characters' });
    } else if (payload.merchantName.length > 100) {
      errors.push({ field: 'merchantName', message: 'Name must be less than 100 characters' });
    }

    // Email validation
    if (!payload.merchantEmail?.trim()) {
      errors.push({ field: 'merchantEmail', message: 'Email is required' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.merchantEmail)) {
        errors.push({ field: 'merchantEmail', message: 'Invalid email format' });
      }
    }

    // Phone validation (optional)
    if (payload.merchantPhone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(payload.merchantPhone.replace(/[\s-]/g, ''))) {
        errors.push({ field: 'merchantPhone', message: 'Invalid phone number format' });
      }
    }

    // Business type validation
    if (payload.businessType && !['individual', 'company'].includes(payload.businessType)) {
      errors.push({ field: 'businessType', message: 'Invalid business type' });
    }

    // Business name required for companies
    if (payload.businessType === 'company' && !payload.businessName?.trim()) {
      errors.push({ field: 'businessName', message: 'Business name is required for companies' });
    }

    return errors;
  }

  static validatePublicKey(publicKey: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!publicKey?.trim()) {
      errors.push({ field: 'publicKey', message: 'Public key is required' });
    } else if (publicKey.length < 16) {
      errors.push({ field: 'publicKey', message: 'Invalid public key format' });
    }

    return errors;
  }
}