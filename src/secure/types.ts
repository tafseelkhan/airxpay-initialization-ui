// src/secure/types.ts

export interface EncryptedData {
  iv: string;           // Initialization vector (base64)
  data: string;         // Encrypted data (base64)
  salt?: string;        // Optional salt for key derivation
}

export interface StoredKey {
  encrypted: EncryptedData;
  timestamp: number;    // When it was stored
  expiresAt: number;    // When it auto-encrypts (1 minute from storage)
}

export interface KeyMetadata {
  name: string;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
}

export type KeyStorage = Map<string, StoredKey>;
export type KeyMetadataStorage = Map<string, KeyMetadata>;

export interface EncryptionConfig {
  algorithm: 'aes-256-gcm' | 'aes-256-cbc';
  keyDerivation: 'pbkdf2' | 'direct';
  iterations?: number;  // For PBKDF2
  memorySafe?: boolean; // Enable memory zeroing
  autoEncryptTimeout: number; // milliseconds (default: 60000)
}

export interface FlixoraEncryptedOptions {
  masterKey?: string;           // Optional master key (if not provided, generate)
  config?: Partial<EncryptionConfig>;
  enableLogging?: boolean;
  namespace?: string;           // Isolate keys in memory
}