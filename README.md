# 📘 AirXPay Initialization UI Components

<div align="center">
  <img src="./assets/images/flixora.png" alt="AirXPay Flixora SDK" width="100"/>
</div>

## 🚀 Overview

AirXPay Initialization UI is a production-ready React & React Native component library designed to streamline seller onboarding in multi-tenant SaaS applications. Built with TypeScript and enterprise-grade architecture, it provides a seamless, animated, and validated multi-step flow for collecting seller information.

> **Part of the Flixora Ecosystem** — Integrated with AirXPay for payments, TizzyGo for logistics, TizzyOS for operations, and soon TizzyChat for real-time notifications.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| ✅ **Multi-step Flow** | Basic Details → KYC → Bank Details → Completion |
| 🎨 **Animated Transitions** | Smooth step transitions with progress tracking |
| 🔒 **Built-in Validation** | Form validation for each step |
| 📸 **Document Upload** | Integrated with Expo ImagePicker for KYC documents |
| 🏦 **Bank Verification** | Country-specific bank details collection |
| 📊 **Progress Tracking** | Visual progress indicator with step status |
| 🔧 **Configurable** | Customizable via AirXPayProvider |
| 📘 **TypeScript** | Fully typed components and hooks |
| 📱 **Cross-platform** | Works with React Native, Expo, and Web |

---

## 📦 Installation

### Prerequisites

Ensure you're in your React Native/Expo project:

```bash
# Required peer dependencies
npm install react-native-paper react-native-country-picker-modal @react-native-community/datetimepicker expo-image-picker expo-linear-gradient

# Or with Yarn
yarn add react-native-paper react-native-country-picker-modal @react-native-community/datetimepicker expo-image-picker expo-linear-gradient
```

### Install the Package

```bash
# For local development
npm install --save path/to/airxpay-initialization-ui

# Or from npm (when published)
npm install airxpay-initialization-ui
```

### Requirements

- React 18+
- React Native >= 0.72
- Expo SDK (optional, for LinearGradient & ImagePicker)

---

## 🏗️ Architecture

```
airxpay-initialization-ui/
├── components/
│   ├── steps/
│   │   ├── BasicDetailsForm.tsx
│   │   ├── KYCVerification.tsx
│   │   ├── BankDetails.tsx
│   │   └── OnboardingComplete.tsx
│   └── SellerOnboardingSheet.tsx
├── contexts/
│   └── AirXPayProvider.tsx
├── api/
│   └── seller.ts
├── hooks/
│   ├── useAirXPay.ts
│   ├── useAirXPaySafe.ts
│   └── useIsAirXPayReady.ts
└── index.ts
```

---

<div align="center">
  <img src="./assets/images/airxpay.png" alt="AirXPay Flixora SDK" width="100"/>
</div>

## 🚀 Quick Start

### 1️⃣ Wrap with Provider

```tsx
// Root.tsx
import React from 'react';
import { AirXPayProvider } from 'airxpay-initialization-ui';
import App from './App';

export default function Root() {
  return (
    <AirXPayProvider
      config={{
        baseUrl: 'https://api.airxpay.com',
        publicKey: 'YOUR_PUBLIC_KEY_HERE',
      }}
    >
      <App />
    </AirXPayProvider>
  );
}
```

### 2️⃣ Implement Onboarding

```tsx
// SellerOnboardingScreen.tsx
import React from 'react';
import { SellerOnboardingSheet } from 'airxpay-initialization-ui';

const MySellerOnboarding = () => {
  return (
    <SellerOnboardingSheet
      sellerId="seller_12345"
      mode="live"
      isKycCompleted={false}
      isBankDetailsCompleted={false}
      kycStatus="pending"
      status="pending"
      onNext={(stepData, currentStep) => {
        console.log(`Step ${currentStep} completed:`, stepData);
      }}
      onBack={(currentStep) => {
        console.log(`Navigated back from step ${currentStep}`);
      }}
      onComplete={(sellerData) => {
        console.log('🎉 Onboarding complete!', sellerData);
      }}
    />
  );
};

export default MySellerOnboarding;
```

---

## 📋 Component API

### SellerOnboardingSheet Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| sellerId | string | ✅ | - | Unique seller identifier |
| mode | 'live' \| 'test' | ✅ | - | Environment mode |
| isKycCompleted | boolean | ✅ | - | KYC completion status |
| isBankDetailsCompleted | boolean | ✅ | - | Bank details status |
| kycStatus | string | ✅ | - | 'pending' \| 'verified' \| 'rejected' |
| status | string | ✅ | - | 'pending' \| 'active' \| 'suspended' |
| initialStep | number | ❌ | 1 | Starting step (1-4) |
| initialData | Partial\<Seller\> | ❌ | {} | Pre-filled seller data |
| loading | boolean | ❌ | false | External loading state |
| onNext | (data: Partial\<Seller\>, step: number) => void | ✅ | - | Step completion callback |
| onBack | (step: number) => void | ✅ | - | Back navigation callback |
| onComplete | (data: Seller) => void | ✅ | - | Final completion callback |

### AirXPayProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| config.baseUrl | string | ✅ | API base URL |
| config.publicKey | string | ✅ | API public key |
| children | ReactNode | ✅ | Child components |

---

## 🎣 Hooks

```tsx
import { 
  useAirXPay, 
  useAirXPaySafe, 
  useIsAirXPayReady,
  useAirXPayConfig 
} from 'airxpay-initialization-ui';

// Access config (throws if no provider)
const { baseUrl, publicKey } = useAirXPay();

// Safe access (returns null if no provider)
const config = useAirXPaySafe();

// Check if provider is ready
const isReady = useIsAirXPayReady();

// Access specific config value
const baseUrl = useAirXPayConfig('baseUrl');
```

---

## 🎨 Customization

### Styling

```tsx
// Override default styles
<SellerOnboardingSheet
  // ... props
  styles={{
    container: { backgroundColor: '#f5f5f5' },
    stepIndicator: { backgroundColor: '#6200ee' }
  }}
/>
```

### Icons & Branding

```tsx
// Custom logo
<SellerOnboardingSheet
  // ... props
  logo={require('./assets/custom-logo.png')}
/>

// Custom step icons via STEPS array modification
```

### Theme Support

```tsx
// Using with React Native Paper
import { Provider as PaperProvider } from 'react-native-paper';

<PaperProvider theme={yourTheme}>
  <AirXPayProvider config={config}>
    <SellerOnboardingSheet {...props} />
  </AirXPayProvider>
</PaperProvider>
```

---

## 🔄 Step Flow

```
Step 1: Basic Details
├── Seller Name
├── Email Address
├── Phone Number
└── Business Type

Step 2: KYC Verification
├── Document Upload (PAN/Aadhar)
├── Selfie Verification
└── Address Proof

Step 3: Bank Details
├── Account Number
├── IFSC Code
├── Account Holder Name
└── Bank Branch

Step 4: Completion
├── Success Animation
├── Summary View
└── Next Steps
```

---

## ⚡ Advanced Usage

### Custom Step Implementation

```tsx
import { useStepContext } from 'airxpay-initialization-ui';

const CustomStep = () => {
  const { stepData, updateStepData, goToNextStep } = useStepContext();
  
  const handleSubmit = () => {
    updateStepData({ customField: 'value' });
    goToNextStep();
  };
  
  return (
    // Your custom UI
  );
};
```

### Error Handling

```tsx
<SellerOnboardingSheet
  onError={(error, step) => {
    switch(error.code) {
      case 'KYC_FAILED':
        showNotification('KYC verification failed');
        break;
      case 'BANK_INVALID':
        showNotification('Invalid bank details');
        break;
    }
  }}
/>
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## 📈 Performance

- **Memoized Components:** All step components are memoized
- **Optimized Re-renders:** Context splitting prevents unnecessary renders
- **Lazy Loading:** Steps load on-demand
- **Animation Optimizations:** Native driver for smooth 60fps transitions

---

## 🔒 Security

- All API calls require valid publicKey
- File uploads are validated client-side
- Sensitive data never stored in logs
- HTTPS enforced for all requests
- XSS protection via input sanitization

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Provider not found | Wrap components in `<AirXPayProvider>` |
| Images not uploading | Check Expo ImagePicker permissions |
| Animation lag | Enable useNativeDriver in config |
| TypeScript errors | Update to latest version |
| Bank validation fails | Check country code format |

---

## 📝 Changelog

### v1.0.5 (Latest)
- Added React 18 support
- Fixed animation performance issues
- Improved TypeScript types
- Added Expo SDK 50+ compatibility
- Enhanced error handling

### v1.0.3
- Initial release
- Basic step flow
- KYC document upload
- Bank details validation

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License © 2026 Flixora Technologies

---

<div align="center">
  <h3>Built with ❤️ by the Flixora Ecosystem</h3>
  <p><strong>Your Smile, Our Simplicity 😊</strong></p>
  <p><sub>Version 1.0.5 | Part of AirXPay, TizzyGo, TizzyOS, and TizzyChat</sub></p>
  <p><i>We upgraded from v1.0.3 to v1.0.5 to maintain version consistency across our ecosystem. Thanks for your understanding!</i></p>
</div>