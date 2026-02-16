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
  <img src="./assets/images/airxpay.png" alt="AirXPay Flixora SDK" width="120"/>
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

# 🎣 Available Hooks

<div align="center">
  
The **@airxpay/sdk-ui** package provides utility hooks for accessing configuration, managing initialization state, **and safely interacting with the AirXPayProvider.**

</div>

```jsx
import { 
  useAirXPay, 
  useAirXPaySafe, 
  useProviderReady, 
  useAirXPayConfig 
} from '@airxpay/sdk-ui';

📋 Quick Reference Matrix

Hook	Returns	Error	Safe	Use Case

useAirXPay	{ baseUrl, publicKey }	⚠️ Throws	❌	Core production components

useAirXPaySafe	config | null	✅ No	✅	Shared/components/testing

useProviderReady	boolean	✅ No	✅	Async/loading states

useAirXPayConfig	string	✅ No	✅	Single value access

🎯 Hook Catalog

<div align="center">
Hook	Behavior	When to Use	Recommended For
</div>

1️⃣ useAirXPay() 🔒 Strict Mode
jsx
const { baseUrl, publicKey } = useAirXPay();

Property	Details
⚠️ Error	Throws if provider missing
📦 Returns	Full config object
🎮 Control	Strict enforcement
Perfect for:

jsx
// ✅ API calls
// ✅ Dynamic endpoints  
// ✅ Advanced integrations
Production Ready 🚀 - Use when provider is guaranteed

2️⃣ useAirXPaySafe() 🛡️ Safe Mode
jsx

const safeConfig = useAirXPaySafe(); // Returns null if no provider
Property	Details
✅ Error	No error, returns null
📦 Returns	Config or null
🎮 Control	Flexible usage
Perfect for:

jsx
// 🧪 Component testing
// 🔌 Optional integrations
// 📦 Shared components
Flexible Choice 🌟 - Use when provider might be missing

3️⃣ useProviderReady() ⏳ State Check
jsx

const isReady = useProviderReady(); // true/false
Property	Details
✅ Error	Never throws
📦 Returns	Boolean
🎮 Control	Async handling
Perfect for:
jsx
// 🎨 Conditional rendering
// ⏰ Loader components
// 🔄 Async workflows
Initialization Guardian 🛡️ - Use for async setup

4️⃣ useAirXPayConfig(key) 🎯 Targeted Access
jsx

const baseUrl = useAirXPayConfig('baseUrl');  // Returns string
const pubKey = useAirXPayConfig('publicKey'); // Returns string
Property	Details
✅ Error	Never throws
📦 Returns	Single value
🎮 Control	Focused access
Perfect for:

jsx
// 🎯 Single config value
// 🧹 Clean code
// ⚡ Minimal access
Precision Tool 🎯 - Use for specific config values

📊 Detailed Comparison Table

Feature	useAirXPay	useAirXPaySafe	useProviderReady	useAirXPayConfig

Return Type	object	object | null	boolean	string

Throws Error	✅ Yes	❌ No	❌ No	❌ No

Null Safe	❌ No	✅ Yes	✅ Yes	✅ Yes

Provider Required	✅ Yes	❌ No	❌ No	❌ No

Use Case	Full config	Optional config	Init state	Single value

Complexity	High	Medium	Low	Low

🎨 Visual Usage Guide
jsx
// 🚀 PRODUCTION - Strict access
function PaymentComponent() {
  const { baseUrl } = useAirXPay(); // Will throw if provider missing
  // ... payment logic
}

// 🧪 TESTING - Flexible access
function SharedButton() {
  const config = useAirXPaySafe(); // Safe, returns null if missing
  return <button>{config?.publicKey || 'No config'}</button>;
}

// ⏰ LOADING - Async handling
function App() {
  const isReady = useProviderReady();
  return isReady ? <Dashboard /> : <Loader />;
}

// 🎯 TARGETED - Single value
function ApiClient() {
  const baseUrl = useAirXPayConfig('baseUrl');
  return fetch(`${baseUrl}/api/data`);
}

💡 Pro Tips Corner

Tip	Hook	Why

🚀 Strict Mode	useAirXPay	When you NEED the provider
🛡️ Defensive Mode	useAirXPaySafe	For shared components
⏳ Loading States	useProviderReady	Handle async gracefully
🎯 Clean Code	useAirXPayConfig	Avoid destructuring

<div align="center">

⚡ Quick Decision Maker
Need guaranteed access? → useAirXPay
Building shared components? → useAirXPaySafe
Handling async loading? → useProviderReady
Just need one value? → useAirXPayConfig

</div> ```

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
  useIsAirXPayReady,    // Hook: checks if provider is ready
  useAirXPayConfig,     // Access specific config value
  AirXPayConsumer       // Context consumer for advanced use
} from '@airxpay/sdk-ui';

// Example usage
const { baseUrl, publicKey } = useAirXPay();
const config = useAirXPaySafe();
const isReady = useIsAirXPayReady();
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
export { AirXPayProvider } from "./contexts/AirXPayProvider";
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
