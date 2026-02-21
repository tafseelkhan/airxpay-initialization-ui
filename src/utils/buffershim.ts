// src/utils/buffer.shim.ts

/**
 * Simple Buffer shim for React Native
 * Just enough to make the SDK work
 */

// Create a minimal Buffer implementation
class SimpleBuffer {
  private _data: Uint8Array;

  constructor(data: Uint8Array) {
    this._data = data;
  }

  toString(encoding?: string): string {
    const decoder = new TextDecoder();
    return decoder.decode(this._data);
  }

  static from(data: any): SimpleBuffer {
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      return new SimpleBuffer(encoder.encode(data));
    }
    if (data instanceof Uint8Array) {
      return new SimpleBuffer(data);
    }
    // Default case
    return new SimpleBuffer(new Uint8Array(0));
  }
}

// Only set if not already defined
if (typeof global.Buffer === 'undefined') {
  // @ts-ignore - We know this is a simplified version
  global.Buffer = SimpleBuffer;
}

export {};