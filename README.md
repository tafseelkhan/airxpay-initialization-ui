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

- [✨ New in v2.0](#-new-in-v20)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [🔐 Secure Key Management (NEW)](#-secure-key-management-new)
- [Architecture](#-architecture)
- [Components](#-components)
- [Hooks](#-hooks)
- [Types](#-types)
- [Examples](#-examples)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ New in v2.0

| Feature | Description |
|---------|-------------|
| **🔐 FlixoraEncrypted Vault** | AES-256 encryption for all sensitive keys |
| **Auto-Encryption** | Keys auto-encrypt after 1 minute of inactivity |
| **Memory Safe** | Keys zeroed out after use, never logged |
| **Flexible Key Names** | Developer can use ANY name for their keys |
| **5-Step Flow** | Added Final Review step before submission |

---

## ✨ Features

✅ **Complete Onboarding Flow** - 5-step merchant onboarding process
✅ **Beautiful UI** - Gradient designs, animations, and modern components
✅ **Form Validation** - Real-time validation with error messages
✅ **Document Upload** - File upload with progress indicators
✅ **KYC Verification** - PAN, Aadhaar, GST validation
✅ **Bank Details** - IFSC validation, account number masking
✅ **🔐 Secure Key Vault** - AES-256 encryption for all keys
✅ **Auto-Encryption** - Keys re-encrypt every 1 minute
✅ **Token Management** - Automatic token refresh and storage
✅ **Error Handling** - Comprehensive error handling with user-friendly messages
✅ **TypeScript** - Full type safety
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

### 1️⃣ Define Your Keys (ANY NAME YOU WANT!)

```javascript
// App.js or index.js - KAHI BHI EK BAAR DEFINE KARO

// ✅ Apni marzi ka naam de sakte ho - "MyApp", "PaymentGateway", "Production", kuch bhi!
process.flixora = {
  MyBusinessApp: {           // 👈 Koi bhi name
    publicKey: 'pk_live_abc123...',
    secretKey: 'sk_live_xyz789...',
    clientKey: 'ck_live_def456...'
  }
};

// ✅ Multiple configurations bhi ho sakti hain
process.flixora = {
  Production: {
    publicKey: 'pk_live_111...',
    secretKey: 'sk_live_222...',
    clientKey: 'ck_live_333...'
  },
  Testing: {
    publicKey: 'pk_test_444...',
    secretKey: 'sk_test_555...',
    clientKey: 'ck_test_666...'
  }
};
```

### 2️⃣ Wrap App with Provider

```tsx
// App.tsx
import { AirXPayProvider } from '@flixora/airxpay-sdk-init-ui';

const App = () => {
  return (
    <AirXPayProvider config={{ enableLogging: __DEV__ }}>
      <YourApp />
    </AirXPayProvider>
  );
};
```

### 3️⃣ Initialize SDK (AUTOMATIC KEY LOADING)

```tsx
// MerchantScreen.tsx
import React, { useEffect } from 'react';
import { useMerchantOnboarding, MerchantOnboarding } from '@flixora/airxpay-sdk-init-ui';

const MerchantScreen = () => {
  const { initialize } = useMerchantOnboarding();
  
  useEffect(() => {
    // ✅ Keys automatically load from process.flixora (kisi bhi name se)
    // ✅ Secret keys automatically encrypt ho jati hain
    initialize(); // No need to pass keys!
  }, []);
  
  const handleComplete = (merchantData) => {
    console.log('Merchant created:', merchantData.merchantId);
  };
  
  return (
    <MerchantOnboarding
      mode="test"
      isKycCompleted={false}
      isBankDetailsCompleted={false}
      kycStatus="not_submitted"
      status="pending"
      onComplete={handleComplete}
    />
  );
};
```

---

## 🔐 Secure Key Management (NEW)

### How Keys Are Secured

```
1. Developer defines keys → process.flixora.ANY_NAME
                    ↓
2. initialize() called → Keys loaded from process
                    ↓
3. 🔐 AES-256 Encryption → "sk_live_123" → "8f9a7e6d5c4b3a2..."
                    ↓
4. Stored in memory vault (never persisted)
                    ↓
5. ⏰ Auto re-encrypts every 1 minute
                    ↓
6. When API called → Decrypts → Original key sent
                    ↓
7. 🧹 Memory zeroed after use
```

### Key Features

| Feature | Description |
|---------|-------------|
| **AES-256-GCM** | Military-grade encryption |
| **Auto-Encryption** | Keys re-encrypt every 60 seconds |
| **Memory Safe** | Buffers zeroed after use |
| **No Logging** | Keys never appear in console |
| **Flexible Names** | Use ANY key name you want |
| **Multiple Configs** | Support multiple environments |

---

## 🏗 Architecture

```
@flixora/airxpay-sdk-init-ui/
├── secure/                          # 🔐 NEW - Secure vault module
│   ├── FlixoraEncrypted.ts          # AES-256 encryption
│   ├── types.ts                      # Vault types
│   └── index.ts                      # Vault exports
├── components/
│   ├── steps/
│   │   ├── BasicDetailsForm
│   │   ├── KYCVerification
│   │   ├── BankDetails
│   │   └── OnboardingComplete
│   └── onboarding/
│       ├── FinalStepScreen           # Step 4: Review
│       └── MerchantOnboarding         # Main container
├── contexts/
│   └── AirXPayProvider
├── hooks/
│   └── useMerchantOnboarding
├── api/
│   ├── merchantProxy
│   └── client
├── utils/
│   ├── tokenStorage
│   └── jwt
└── types/
    └── merchantTypes
```

---

## 🎨 Components

### MerchantOnboarding (5-Step Flow)

```tsx
<MerchantOnboarding
  mode="test"                       
  isKycCompleted={false}             
  isBankDetailsCompleted={false}     
  kycStatus="not_submitted"          
  status="pending"                   
  onNext={(data, step) => {}}        
  onBack={(step) => {}}              
  onComplete={(merchant) => {}}      
/>
```

#### Steps Overview

| Step | Name | Description |
|------|------|-------------|
| 1 | Basic Details | Name, email, phone, business type |
| 2 | KYC Verification | PAN, Aadhaar, document upload |
| 3 | Bank Details | Account, IFSC, cancelled cheque |
| 4 | Final Review | Review & submit (NEW) |
| 5 | Complete | Success screen with status |

---

## 🪝 Hooks

### useMerchantOnboarding

```tsx
const {
  loading,                          // boolean
  error,                            // AppError | null
  merchantData,                      // Merchant data
  merchantStatus,                    // Status data
  initialize,                        // (publicKey?) => void
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
```

---

## 💡 Complete Example

```tsx
// App.tsx - Complete Production Example
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { 
  AirXPayProvider,
  useMerchantOnboarding,
  MerchantOnboarding,
  OnboardingCompleteScreen 
} from '@flixora/airxpay-sdk-init-ui';

// ✅ 1. Define keys - KISI BHI NAME SE
process.flixora = {
  LiveMerchant: {
    publicKey: 'pk_live_abc123...',
    secretKey: 'sk_live_xyz789...',   // 👈 Auto-encrypted
    clientKey: 'ck_live_def456...'     // 👈 Auto-encrypted
  }
};

function App() {
  return (
    <AirXPayProvider config={{ enableLogging: true }}>
      <SafeAreaView style={{ flex: 1 }}>
        <OnboardingFlow />
      </SafeAreaView>
    </AirXPayProvider>
  );
}

function OnboardingFlow() {
  const [step, setStep] = useState<'onboarding' | 'complete'>('onboarding');
  const { initialize, createMerchant } = useMerchantOnboarding();
  
  useEffect(() => {
    // ✅ Keys auto-load from process.flixora
    // ✅ Secret keys auto-encrypt in memory
    initialize();
  }, []);
  
  const handleComplete = async (data) => {
    // ✅ When API called, keys auto-decrypt
    // ✅ Original keys sent to backend
    setStep('complete');
  };
  
  if (step === 'onboarding') {
    return (
      <MerchantOnboarding
        mode="live"
        isKycCompleted={false}
        isBankDetailsCompleted={false}
        kycStatus="not_submitted"
        status="pending"
        onComplete={handleComplete}
      />
    );
  }
  
  return (
    <OnboardingCompleteScreen
      onContinue={() => console.log('Navigate to dashboard')}
      onLogout={() => setStep('onboarding')}
    />
  );
}

export default App;
```

---

## 🔄 What Happens Behind the Scenes

```javascript
// 1. User defines keys
process.flixora.MyApp = {
  secretKey: 'sk_live_123'
};

// 2. initialize() called
initialize();

// 3. 🔐 Keys automatically encrypted
// "sk_live_123" → "8f9a7e6d5c4b3a21..."

// 4. 1 minute later - auto re-encrypts
// "8f9a7e6d5c4b3a21..." → "1a2b3c4d5e6f7g8h..."

// 5. createMerchant() called
const response = await createMerchant(data);

// 6. 🔓 Keys automatically decrypted
// "8f9a7e6d5c4b3a21..." → "sk_live_123"

// 7. API call with original keys
// 8. Memory zeroed after use
```

---

## ❓ FAQ

### Q: Can I use any name for my keys?
**A:** YES! Koi bhi name use kar sakte ho - `MyApp`, `PaymentGateway`, `Production`, kuch bhi!

### Q: Keys safe hain?
**A:** Bilkul! AES-256 encryption, auto re-encrypt har 1 minute mein, memory zero after use.

### Q: Expo support?
**A:** Haan! Fully compatible with Expo SDK 50+.

### Q: Token refresh kaise hota hai?
**A:** Automatic - SDK checks expiry, queues requests, refreshes token.

---

## 📄 License

MIT © [Flixora](https://flixora.com)

---

<div align="center">
  <sub>Built with ❤️ by the Flixora Team</sub>
  <br/>
  <sub>© 2026 Flixora. All rights reserved.</sub>
</div>

---

## 🚀 Quick Summary for Production

| Step | Action |
|------|--------|
| 1 | `npm install @flixora/airxpay-sdk-init-ui` |
| 2 | Define keys: `process.flixora.ANY_NAME = { publicKey, secretKey, clientKey }` |
| 3 | Wrap app with `<AirXPayProvider>` |
| 4 | Call `initialize()` in your component |
| 5 | Use `<MerchantOnboarding />` component |
| 6 | **DONE!** 🎉 Keys auto-encrypt, auto-decrypt, auto-refresh |