// types/sellertypes.ts

export type BusinessType = 'individual' | 'company';
export type Mode = 'test' | 'live';
export type KYCStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';
export type SellerStatus = 'active' | 'suspended' | 'blocked';

export interface KYCDocuments {
  panCardUrl?: string;
  aadhaarUrl?: string;
  identityProofUrl?: string;
  addressProofUrl?: string;
  selfieUrl?: string;
  businessRegistrationUrl?: string;
  gstCertificateUrl?: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  cancelledChequeUrl?: string;
}

export interface Seller {
  _id?: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  businessName?: string;
  businessType: BusinessType;
  businessCategory?: string;
  country: string;
  dob?: string;
  nationality?: string;
  mode: Mode;
  kycStatus: KYCStatus;
  isKycCompleted: boolean;
  kycDocuments?: KYCDocuments;
  bankDetails?: BankDetails;
  isBankDetailsCompleted: boolean;
  status: SellerStatus;
  sellerDID?: string;
  walletId?: string;
  developerId?: string;
  developerUserId?: string;
  developerClientKey?: string;
  onboardedPlatforms?: string[];
}

export interface SellerOnboardingProps {
  sellerId?: string;
  mode: Mode;
  initialStep?: number;
  isKycCompleted: boolean;
  isBankDetailsCompleted: boolean;
  kycStatus: KYCStatus;
  status: SellerStatus;
  initialData?: Partial<Seller>;
  onNext: (stepData: Partial<Seller>, step: number) => void;
  onBack: (currentStep: number) => void;
  onComplete: (sellerData: Seller) => void;
  loading?: boolean;
}

export interface StepConfig {
  id: number;
  name: string;
  key: 'basic' | 'kyc' | 'bank' | 'complete';
  isRequired: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}