// src/core/webhooks/IdempotencyStore.ts

import { Logger } from '../../utils/log/logger';
import { IdempotencyRecord } from '../events/types';

/**
 * In-memory idempotency store for webhook deduplication
 * Automatically cleans up old records
 */
export class IdempotencyStore {
  private store: Map<string, IdempotencyRecord> = new Map();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(private logger: Logger) {}

  /**
   * Check if event has been processed
   */
  async check(id: string): Promise<boolean> {
    const record = this.store.get(id);
    
    if (!record) {
      return false;
    }

    // Check if record has expired
    if (Date.now() - record.processedAt > this.TTL) {
      this.store.delete(id);
      return false;
    }

    return record.completed;
  }

  /**
   * Mark event as processing
   */
  async set(id: string): Promise<void> {
    this.store.set(id, {
      id,
      processedAt: Date.now(),
      completed: false
    });
    
    this.logger.debug('Idempotency record created', { id });
  }

  /**
   * Mark event as completed
   */
  async complete(id: string, response?: any): Promise<void> {
    const record = this.store.get(id);
    if (record) {
      record.completed = true;
      record.response = response;
      this.logger.debug('Idempotency record completed', { id });
    }
  }

  /**
   * Get record (for debugging)
   */
  async get(id: string): Promise<IdempotencyRecord | undefined> {
    return this.store.get(id);
  }

  /**
   * Clean up expired records
   */
  cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [id, record] of this.store.entries()) {
      if (now - record.processedAt > this.TTL) {
        this.store.delete(id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.logger.debug('Cleaned up expired idempotency records', {
        count: deletedCount
      });
    }
  }

  /**
   * Clear all records (for testing/shutdown)
   */
  clear(): void {
    this.store.clear();
    this.logger.debug('Idempotency store cleared');
  }

  /**
   * Get store size
   */
  size(): number {
    return this.store.size;
  }
}