# 📘 AirXPay Initialization UI Components

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

---

<div align="center">
  <img src="./src/assets/images/airxpay.png" alt="AirXPay Flixora SDK" width="120"/>
</div>

---

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
| 📘 **TypeScript** | Fully typed components, hooks, and classes |
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
# Install the package from npm
npm install @airxpay/sdk-ui

# Install package from yarn
yarn add @airxpay/sdk-ui
```

### Requirements

- React 18+
- React Native >= 0.72
- Expo SDK (optional, for LinearGradient & ImagePicker)

---

## 🏗️ Architecture

```
@airxpay/sdk-ui/
├── components/
│   ├── steps/
│   │   ├── BasicDetailsForm.tsx
│   │   ├── KYCVerification.tsx
│   │   ├── BankDetails.tsx
│   │   └── OnboardingComplete.tsx
│   └── ui/
│       └── SellerOnboard/
│           └── SellerOnboarding.tsx
├── contexts/
│   └── AirXPayProvider.tsx
├── hooks/
│   └── SellerOnboarding.tsx      # useAirXPaySheet
├── api/
│   └── seller.ts                  # verifyPublicKey
├── types/
│   ├── dev.ts                     # __DEV__
│   └── type.ts                     # AirXPayConfig
└── index.ts                        # Main exports
```

---

## 🚀 Quick Start

### 1️⃣ Wrap with Provider

```tsx
// Root.tsx
import React from 'react';
import { AirXPayProvider } from '@airxpay/sdk-ui';
import App from './App';

export default function Root() {
  return (
    <AirXPayProvider
      config={{
        baseUrl: 'https://api.airxpay.com',
        publicKey: 'YOUR_PUBLIC_KEY_HERE',
      }}
      enableLogging={__DEV__} // Optional: enables detailed logs in development
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
import { useAirXPaySheet } from '@airxpay/sdk-ui';

const MySellerOnboarding = () => {
  return (
    <useAirXPaySheet
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

### useAirXPaySheet Props

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

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| config.baseUrl | string | ✅ | - | API base URL (must be valid URL) |
| config.publicKey | string | ✅ | - | API public key (min 20 chars) |
| children | ReactNode | ✅ | - | Child components |
| enableLogging | boolean | ❌ | \_\_DEV\_\_ | Enable/disable console logs |

---

## 🎣 Hooks & Utilities

```tsx
import { 
  useAirXPay,           // Access config (throws if no provider)
  useAirXPaySafe,       // Safe access (returns null if no provider)
  useProviderReady,    // Hook: checks if provider is ready
  useAirXPayConfig,     // Access specific config value
  AirXPayConsumer       // Context consumer for advanced use
} from '@airxpay/sdk-ui';

// Example usage
const { baseUrl, publicKey } = useAirXPay();
const config = useAirXPaySafe();
const isReady = useProviderReady();
const baseUrl = useAirXPayConfig('baseUrl');
```

### ⚡ Class-based Initialization

The package also provides a class-based approach for scenarios where you need to initialize the SDK asynchronously:

```tsx
import { useIsAirXPayReady } from '@airxpay/sdk-ui';

// Initialize with config
const airxpay = new useIsAirXPayReady({
  baseUrl: 'https://api.airxpay.com',
  publicKey: 'your_public_key_here'
});

// Verify credentials asynchronously
async function initializeSDK() {
  try {
    const result = await airxpay.initialize();
    console.log('SDK initialized successfully:', result);
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}
```

---

## 🔧 Configuration Validation

The `AirXPayProvider` includes built-in validation that throws clear, actionable errors:

```tsx
// ❌ This will throw a detailed error
<AirXPayProvider
  config={{
    baseUrl: 'not-a-url',
    publicKey: 'short'
  }}
>
  <App />
</AirXPayProvider>

// Error message:
// AirXPayProvider Configuration Error:
//   • baseUrl must be a valid URL
//   • publicKey appears to be invalid
```

---

## 🎨 Customization

### Styling

```tsx
<useAirXPaySheet
  // ... props
  styles={{
    container: { backgroundColor: '#f5f5f5' },
    stepIndicator: { backgroundColor: '#6200ee' }
  }}
/>
```

### Theme Support

```tsx
import { Provider as PaperProvider } from 'react-native-paper';

<PaperProvider theme={yourTheme}>
  <AirXPayProvider config={config}>
    <useAirXPaySheet {...props} />
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

## 📝 Exports Reference

```tsx
// Main exports from index.ts
export { useIsAirXPayReady } from "./sdk/airxpay";           // Class for async init
export { AirXPayProvider, useProviderReady, useAirXPayConfig, useAirXPaySafe, useAirXPay } from "./contexts/AirXPayProvider";
export { default as useAirXPaySheet } from "./hooks/SellerOnboarding";
export { __DEV__ } from './types/dev';

// Also available via context
export { 
  useAirXPay,
  useAirXPaySafe,
  useAirXPayConfig,
  AirXPayConsumer 
} from './contexts/AirXPayProvider';
```

---

## 🧪 Development Utilities

```tsx
import { __DEV__ } from '@airxpay/sdk-ui';

if (__DEV__) {
  console.log('Running in development mode');
}
```

The `__DEV__` flag helps you conditionally run code only in development environments.

---

## 📈 Performance

- **Memoized Components:** All step components are memoized
- **Optimized Re-renders:** Context splitting prevents unnecessary renders
- **Lazy Loading:** Steps load on-demand
- **Development Logging:** Auto-disabled in production via `__DEV__`

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
| "useAirXPay must be used within AirXPayProvider" | Wrap your component tree with provider |
| "Public key appears to be invalid" | Check if publicKey is at least 20 chars |
| "baseUrl must be a valid URL" | Include protocol (https://) in baseUrl |
| Images not uploading | Check Expo ImagePicker permissions |
| TypeScript errors | Update to latest version |

---

# 🎣 Available Hooks

The **@airxpay/sdk-ui** package provides several utility hooks for accessing configuration, managing initialization state, **and safely interacting with the AirXPayProvider.**

```
import { 
  useAirXPay, 
  useAirXPaySafe, 
  useProviderReady, 
  useAirXPayConfig 
} from '@airxpay/sdk-ui';

1️⃣ useAirXPay()
const { baseUrl, publicKey } = useAirXPay();
```

**Provides direct access to the full AirXPay configuration.**

**Behavior**

Must be used inside AirXPayProvider.

Throws an error if the provider is not found.

Ensures strict enforcement of provider usage.

When to Use

Use this hook when you require guaranteed access to configuration values such as baseUrl or publicKey for:

API requests

Dynamic endpoint handling

**Advanced integrations**

# Recommended for: Production components where the provider is always present.

```
2️⃣ useAirXPaySafe()
const safeConfig = useAirXPaySafe();
```

A safe alternative to ```useAirXPay().```

Behavior

Returns null if the provider is not available.

Does not throw an error.

When to Use

Component testing in isolation

Optional integrations

Shared UI components that may or may not be wrapped in the provider

Recommended for: Flexible usage scenarios where provider presence is not guaranteed.

```
3️⃣ useProviderReady()
const isReady = useProviderReady();
```

Checks whether the SDK has been fully initialized.

Behavior

Returns a boolean indicating initialization state.

Useful for asynchronous setup workflows.

When to Use

Conditional rendering

Showing loaders before initialization

Delaying onboarding UI until SDK is ready

Recommended for: Applications using async initialization or class-based setup.

```
4️⃣ useAirXPayConfig(key)
const apiUrl = useAirXPayConfig('baseUrl');
```

Retrieves a specific configuration value from the provider.

Behavior

Accepts a configuration key ```(e.g., 'baseUrl', 'publicKey').```

Returns only the requested value.

When to Use

Accessing a single configuration property

Avoiding full object destructuring

Cleaner and more focused component logic

Recommended for: Minimal, targeted configuration access.

```📌 Hook Comparison```
**Hook	Throws Error	Safe Fallback	Primary Purpose**

```
useAirXPay	✅ Yes	❌ No	Direct access to full configuration
useAirXPaySafe	❌ No	✅ Yes	Optional/safe configuration access
useProviderReady	❌ No	✅ Yes	Initialization state check
useAirXPayConfig	❌ No	✅ Yes	Access a single configuration value
```


---

## 📝 Changelog

### v1.0.5 (Latest)
- Added class-based `useIsAirXPayReady` for async initialization
- Enhanced error messages with stack traces
- Added `__DEV__` flag for environment detection
- Improved TypeScript types
- Added `enableLogging` prop to provider

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
