# 🚀 @flixora/airxpay-sdk-init-ui

<div align="center">
  <img src="./src/assets/images/airxpay.png" alt="AirXPay" width="120"/>
  <h3>Complete Merchant Onboarding Solution for React Native</h3>
  <p>Beautiful, production-ready UI components for seamless merchant onboarding</p>
</div>

---

<p align="center">
  <a href="#-typescript">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </a>
  <a href="#-react">
    <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react" alt="React" />
  </a>
  <a href="#-react-native">
    <img src="https://img.shields.io/badge/React_Native-0.72+-61DAFB?style=for-the-badge&logo=react" alt="React Native" />
  </a>
  <a href="#-expo">
    <img src="https://img.shields.io/badge/Expo-50+-000020?style=for-the-badge&logo=expo" alt="Expo" />
  </a>
  <a href="#-nextjs">
    <img src="https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
  </a>
  <a href="#-javascript">
    <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript" alt="JavaScript" />
  </a>
  <a href="#-typescript">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </a>
  <a href="#-mit-license">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=open-source-initiative" alt="MIT License" />
  </a>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Components](#-components)
- [API Reference](#-api-reference)
- [Hooks](#-hooks)
- [Types](#-types)
- [Backend Integration](#-backend-integration)
- [Examples](#-examples)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

✅ **Complete Onboarding Flow** - 5-step merchant onboarding process
✅ **Beautiful UI** - Gradient designs, animations, and modern components
✅ **Form Validation** - Real-time validation with error messages
✅ **Document Upload** - File upload with progress indicators
✅ **KYC Verification** - PAN, Aadhaar, GST validation
✅ **Bank Details** - IFSC validation, account number masking
✅ **Token Management** - Automatic token refresh and storage
✅ **Error Handling** - Comprehensive error handling with user-friendly messages
✅ **TypeScript** - Full type safety
✅ **Modular Architecture** - Clean separation of concerns
✅ **Production Ready** - Battle-tested code

---

## 📦 Installation

```bash
npm install @flixora/airxpay-sdk-init-ui
# or
yarn add @flixora/airxpay-sdk-init-ui
```

### Peer Dependencies

```bash
npm install react react-native react-native-paper @react-native-async-storage/async-storage expo-linear-gradient @react-native-community/datetimepicker
```

---

## 🚀 Quick Start

### 1. Wrap your app with Provider

```tsx
// App.tsx
import { AirXPayProvider } from '@flixora/airxpay-sdk-init-ui';

const App = () => {
  const config = {
    publicKey: 'your_public_key_here',
    environment: 'test', // or 'live'
    enableLogging: __DEV__,
  };

  return (
    <AirXPayProvider config={config}>
      <YourApp />
    </AirXPayProvider>
  );
};
```

### 2. Use the Onboarding Component

```tsx
// MerchantOnboardingScreen.tsx
import React from 'react';
import { MerchantOnboarding } from '@flixora/airxpay-sdk-init-ui';

const MerchantOnboardingScreen = () => {
  const handleComplete = (merchantData) => {
    console.log('Onboarding complete:', merchantData);
    // Navigate to next screen
  };

  return (
    <MerchantOnboarding
      mode="test"
      isKycCompleted={false}
      isBankDetailsCompleted={false}
      kycStatus="not_submitted"
      status="pending"
      onNext={(data, step) => console.log('Step:', step, data)}
      onBack={(step) => console.log('Back to:', step)}
      onComplete={handleComplete}
    />
  );
};
```

---

## 🏗 Architecture

```
@flixora/airxpay-sdk-init-ui/
├── components/
│   ├── steps/
│   │   ├── BasicDetailsForm      # Step 1: Basic Info
│   │   ├── KYCVerification       # Step 2: KYC Documents
│   │   ├── BankDetails           # Step 3: Bank Account
│   │   └── OnboardingComplete    # Step 5: Success Screen
│   └── onboarding/
│       ├── FinalStepScreen        # Step 4: Review & Submit
│       └── MerchantOnboarding     # Main Container (5 steps)
├── contexts/
│   └── AirXPayProvider            # Global Context
├── hooks/
│   └── useMerchantOnboarding       # Custom Hook
├── api/
│   ├── merchantProxy               # API Proxy Functions
│   └── client                      # HTTP Client
├── utils/
│   ├── tokenStorage                # Token Management
│   └── jwt                         # JWT Utilities
├── types/
│   └── merchantTypes               # TypeScript Types
└── etc/
    └── constants                   # App Constants
```

---

## 🎨 Components

### MerchantOnboarding (5-Step Flow)

The main container component that manages the entire onboarding flow.

```tsx
<MerchantOnboarding
  mode="test"                       // 'test' | 'live'
  isKycCompleted={false}             // Initial KYC status
  isBankDetailsCompleted={false}     // Initial bank status
  kycStatus="not_submitted"          // 'not_submitted' | 'pending' | 'verified' | 'rejected'
  status="pending"                   // 'pending' | 'active' | 'suspended' | 'blocked'
  onNext={(data, step) => {}}        // Step completion callback
  onBack={(step) => {}}              // Back navigation callback
  onComplete={(merchant) => {}}      // Final completion callback
/>
```

#### Steps Overview

| Step | Name | Description |
|------|------|-------------|
| 1 | Basic Details | Name, email, phone, business type |
| 2 | KYC Verification | PAN, Aadhaar, document upload |
| 3 | Bank Details | Account number, IFSC, cancelled cheque |
| 4 | Final Review | Review & submit to backend |
| 5 | Complete | Success screen with merchant status |

---

### BasicDetailsForm

Collects basic merchant information.

**Props:**
```tsx
interface BasicDetailsFormProps {
  initialData: Partial<Merchant>;
  onNext: (data: Partial<Merchant>) => void;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
}
```

**Features:**
- ✅ Real-time validation
- ✅ Business type toggle (Individual/Company)
- ✅ Country dropdown
- ✅ Date of birth picker
- ✅ Category selection chips

---

### KYCVerification

Handles KYC document collection and verification.

**Props:**
```tsx
interface KYCVerificationProps {
  initialData: Partial<Merchant>;
  mode: Mode;
  kycStatus: KycStatus;
  onNext: (data: Partial<Merchant>) => void;
  onBack: () => void;
}
```

**Documents Collected:**
- 📄 PAN Card
- 🆔 Aadhaar Card
- 📸 Selfie
- 🏠 Address Proof

**Features:**
- ✅ Document type validation
- ✅ Upload progress indicator
- ✅ Status badges
- ✅ Progress tracking

---

### BankDetails

Collects bank account information.

**Props:**
```tsx
interface BankDetailsProps {
  initialData: Partial<Merchant>;
  mode: Mode;
  onNext: (data: Partial<Merchant>) => void;
  onBack: () => void;
}
```

**Fields:**
- 👤 Account Holder Name
- 🏦 Bank Name
- 💳 Account Number (masked)
- 🔢 IFSC Code (with validation)
- 📱 UPI ID (optional)
- 📄 Cancelled Cheque Upload

**Features:**
- ✅ IFSC code validation
- ✅ Account number masking
- ✅ Real-time validation
- ✅ Test mode notice

---

### FinalStepScreen

Review and submit final merchant data.

**Props:**
```tsx
interface FinalStepScreenProps {
  publicKey: string;
  onSuccess: (response: any) => void;
  onError?: (error: any) => void;
  initialData?: Partial<CreateMerchantPayload>;
}
```

**Features:**
- ✅ Review all entered information
- ✅ Terms agreement checkbox
- ✅ Loading state during submission
- ✅ Error handling with alerts

---

### OnboardingCompleteScreen

Displays merchant status after successful creation.

**Props:**
```tsx
interface OnboardingCompleteScreenProps {
  onContinue?: () => void;
  onLogout?: () => void;
  autoFetch?: boolean;
}
```

**Features:**
- ✅ Auto-fetch merchant status
- ✅ Status badges (Active/Suspended/Blocked)
- ✅ KYC status display
- ✅ Refresh button
- ✅ Continue & Logout buttons

---

## 🪝 Hooks

### useMerchantOnboarding

```tsx
const {
  loading,                          // boolean - API call in progress
  error,                            // AppError | null
  merchantData,                      // MerchantCreateResponse | null
  merchantStatus,                    // MerchantStatusResponse | null
  initialize,                        // (publicKey: string) => void
  createMerchant,                     // (payload) => Promise
  fetchStatus,                        // () => Promise
  clearError,                         // () => void
  reset                               // () => void
} = useMerchantOnboarding();
```

### useAirXPay

```tsx
const {
  publicKey,
  isValid,
  loading,
  merchantData,
  hasToken,
  merchantId,
  logout
} = useAirXPay();
```

### useAirXPaySafe

Safe version that returns `null` instead of throwing error.

### useProviderReady

Returns `boolean` indicating if provider is ready.

---

## 📚 API Reference

### merchantProxy.ts

| Function | Description |
|----------|-------------|
| `initializeInternalApi(publicKey)` | Initialize SDK with public key |
| `createMerchantInternal(payload)` | Create merchant via backend proxy |
| `getMerchantStatusInternal()` | Fetch merchant status |
| `refreshMerchantTokenInternal()` | Refresh auth token |
| `verifyPublicKey(publicKey)` | Verify public key validity |

### tokenStorage.ts

| Function | Description |
|----------|-------------|
| `getStoredToken()` | Get stored token |
| `setStoredToken(token)` | Store token |
| `clearStoredToken()` | Clear stored token |
| `storeMerchantData(data)` | Cache merchant data |
| `getStoredMerchantData()` | Get cached merchant data |

### jwt.ts

| Function | Description |
|----------|-------------|
| `decodeJWT(token)` | Decode JWT payload |
| `getMerchantIdFromToken(token)` | Extract merchant ID |
| `isTokenExpired(token)` | Check token expiry |

---

## 📝 Types

```tsx
type BusinessType = 'individual' | 'company';
type Mode = 'test' | 'live';
type MerchantStatus = 'active' | 'suspended' | 'blocked' | 'pending';
type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

interface Merchant {
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  merchantPhone?: string;
  businessName?: string;
  businessType?: BusinessType;
  kycStatus: KycStatus;
  status: MerchantStatus;
  mode: Mode;
  // ... more fields
}

interface CreateMerchantPayload {
  merchantName: string;
  merchantEmail: string;
  merchantPhone?: string;
  businessName?: string;
  businessType?: BusinessType;
  mode?: Mode;
  // ... more fields
}
```

---

## 🔧 Backend Integration

### Required Backend Endpoints

```tsx
// Your backend must implement these endpoints:
POST   /api/merchant/create           // Create merchant (uses secret key)
GET    /api/merchant/status            // Get merchant status
POST   /api/merchant/refresh-token     // Refresh token
POST   /api/merchant/verify-public-key // Verify public key
```

### Backend Example (Node.js/Express)

```tsx
// backend/routes/merchant.ts
import { initializeInternalApi, createMerchantInternal } from '@airxpay/internal-sdk';

// Initialize with SECRET KEY (server-side only!)
initializeInternalApi(process.env.AIRXPAY_SECRET_KEY);

router.post('/create', async (req, res) => {
  try {
    const { publicKey, ...payload } = req.body;
    
    // Validate public key
    if (!publicKey) {
      return res.status(400).json({ error: 'Public key required' });
    }

    // Create merchant using secret key
    const result = await createMerchantInternal(payload);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 💡 Examples

### Complete Implementation

```tsx
// App.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { 
  AirXPayProvider, 
  MerchantOnboarding,
  OnboardingCompleteScreen 
} from '@flixora/airxpay-sdk-init-ui';

export default function App() {
  const [step, setStep] = useState<'onboarding' | 'complete'>('onboarding');
  const [merchantData, setMerchantData] = useState(null);

  const config = {
    publicKey: 'pk_test_your_public_key',
    environment: 'test',
  };

  const handleComplete = (data) => {
    setMerchantData(data);
    setStep('complete');
  };

  return (
    <AirXPayProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        {step === 'onboarding' ? (
          <MerchantOnboarding
            mode="test"
            isKycCompleted={false}
            isBankDetailsCompleted={false}
            kycStatus="not_submitted"
            status="pending"
            onNext={(data, step) => console.log('Step:', step)}
            onBack={(step) => console.log('Back:', step)}
            onComplete={handleComplete}
          />
        ) : (
          <OnboardingCompleteScreen
            onContinue={() => console.log('Navigate to dashboard')}
            onLogout={() => {
              setStep('onboarding');
              setMerchantData(null);
            }}
          />
        )}
      </SafeAreaView>
    </AirXPayProvider>
  );
}
```

### Custom Navigation

```tsx
const config = {
  publicKey: 'pk_test_...',
  customNavigation: {
    buttonText: 'Go to Dashboard',
    screenName: 'Dashboard'
  }
};
```

---

## ❓ FAQ

### Q: Public key vs Secret key - where to use?

**A:** 
- **Public Key** - Used on frontend (in `AirXPayProvider`)
- **Secret Key** - Used on backend only (never expose to frontend)

### Q: How does token refresh work?

**A:** The SDK automatically:
1. Checks token expiry before each request
2. Queues requests during token refresh
3. Retries failed requests with new token
4. Logs out user if refresh fails

### Q: Can I customize the UI?

**A:** Yes! All components accept custom styles via `style` props. You can also override colors by modifying the theme in `react-native-paper`.

### Q: How do I handle errors?

**A:** The SDK provides comprehensive error handling:
```tsx
try {
  await createMerchant(payload);
} catch (error) {
  // error.userMessage - User-friendly message
  // error.message - Technical message
  // error.code - Error code
  Alert.alert('Error', error.userMessage);
}
```

### Q: Is Expo supported?

**A:** Yes! Fully compatible with Expo SDK 50+. Uses `expo-linear-gradient` and `@react-native-community/datetimepicker` which are Expo-compatible.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/airxpay/sdk-init-ui.git
cd sdk-init-ui
npm install
npm run storybook  # Run component library
```

---

## 📄 License

MIT © [AirXPay](https://airxpay.com)

---

<div align="center">
  <sub>Built with ❤️ by the AirXPay Team</sub>
  <br/>
  <sub>© 2026 AirXPay. All rights reserved.</sub>
</div>