// types/merchantTypes.ts

export interface AirXPayConfig {
  publicKey: string;
}

export interface MerchantData {
  merchantName: string;
  merchantEmail: string;
  merchantPhone?: string;
}
