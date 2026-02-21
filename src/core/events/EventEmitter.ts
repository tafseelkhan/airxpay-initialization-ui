// src/core/events/EventEmitter.ts

import { Logger } from '../../utils/log/logger';

type EventHandler<T = any> = (event: T) => void | Promise<void>;

/**
 * Internal event emitter with namespaced events
 * Developers don't interact with this directly
 */
export class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<keyof T, Set<EventHandler>> = new Map();
  private wildcardListeners: Set<EventHandler> = new Set();

  constructor(private logger: Logger) {}

  /**
   * Register event listener
   */
  on<K extends keyof T>(
    event: K,
    handler: EventHandler<T[K]>
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    
    this.logger.debug(`Listener registered for: ${String(event)}`);
  }

  /**
   * Remove event listener
   */
  off<K extends keyof T>(
    event: K,
    handler: EventHandler<T[K]>
  ): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
    this.logger.debug(`Listener removed for: ${String(event)}`);
  }

  /**
   * Emit event to all listeners
   */
  emit<K extends keyof T>(
    event: K,
    eventData: T[K]
  ): void {
    this.logger.debug(`Emitting event: ${String(event)}`, {
      eventId: eventData.id,
      type: eventData.type
    });

    // Dispatch to specific event listeners
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          Promise.resolve(handler(eventData)).catch(error => {
            this.logger.error(`Error in event handler for ${String(event)}:`, error);
          });
        } catch (error) {
          this.logger.error(`Error in event handler for ${String(event)}:`, error);
        }
      });
    }

    // Dispatch to wildcard listeners (*)
    this.wildcardListeners.forEach(handler => {
      try {
        Promise.resolve(handler(eventData)).catch(error => {
          this.logger.error(`Error in wildcard handler for ${String(event)}:`, error);
        });
      } catch (error) {
        this.logger.error(`Error in wildcard handler for ${String(event)}:`, error);
      }
    });
  }

  /**
   * Register wildcard listener (all events)
   */
  onAny(handler: EventHandler): void {
    this.wildcardListeners.add(handler);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
    this.wildcardListeners.clear();
    this.logger.debug('All event listeners removed');
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: keyof T): number {
    return this.listeners.get(event)?.size || 0;
  }
}