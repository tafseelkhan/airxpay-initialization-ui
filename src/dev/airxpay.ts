import { verifyPublicKey } from "../api/merchantProxy";

import { AirXPayConfig } from '../types';

export class useIsAirXPayReady {
  private publicKey: string;

  constructor(config: AirXPayConfig) {
    if (!config.publicKey) throw new Error("Public key is required");

    this.publicKey = config.publicKey;
  }

  async initialize() {
    return await verifyPublicKey(this.publicKey);
  }
}
