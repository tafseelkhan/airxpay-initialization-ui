import { verifyPublicKey } from "../api/seller";

export interface AirXPayConfig {
  baseUrl: string;
  publicKey: string;
}

export class AirXPay {
  private baseUrl: string;
  private publicKey: string;

  constructor(config: AirXPayConfig) {
    if (!config.baseUrl) throw new Error("Base URL is required");
    if (!config.publicKey) throw new Error("Public key is required");

    this.baseUrl = config.baseUrl;
    this.publicKey = config.publicKey;
  }

  async initialize() {
    return await verifyPublicKey(this.baseUrl, this.publicKey);
  }
}
