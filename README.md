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
  
## 🚀 Supercharge Your Integration

The **@airxpay/sdk-ui** package provides powerful utility hooks for accessing configuration, managing initialization state, **and safely interacting with the AirXPayProvider.**

</div>

<br>
<br>

```jsx
import { 
  useAirXPay, 
  useAirXPaySafe, 
  useProviderReady, 
  useAirXPayConfig 
} from '@airxpay/sdk-ui';
<br> <hr> <br>
📊 Hook Comparison Matrix

Hook	Return Type	Error Handling	Safety	Best For	Complexity
useAirXPay	object	⚠️ Throws	❌ Strict	Production	🔴 High
useAirXPaySafe	object | null	✅ Silent	🛡️ Safe	Shared Components	🟡 Medium
useProviderReady	boolean	✅ Silent	⏳ State	Async Loading	🟢 Low
useAirXPayConfig	string	✅ Silent	🎯 Targeted	Single Values	🟢 Low
<br> <hr> <br>
🎯 Detailed Hook Catalog
<br> <br>
1️⃣ useAirXPay() — Full Configuration Access

jsx
const { baseUrl, publicKey } = useAirXPay();

<div align="center">
Property	Specification	Icon
Returns	{ baseUrl: string, publicKey: string }	📦
Error	Error if provider missing	⚠️
Provider Required	✅ Yes	🔒
Null Safety	❌ No	🚫
</div>
🎬 Usage Examples

jsx
// ✅ API Requests
const { baseUrl } = useAirXPay();
const response = await fetch(`${baseUrl}/api/payments`);

// ✅ Dynamic Endpoints
const { publicKey } = useAirXPay();
const client = new AirXClient(publicKey);

// ✅ Advanced Integrations
const config = useAirXPay();
initializeSDK(config);

💼 Production Ready — Use when provider is guaranteed to exist

<br> <hr> <br>
2️⃣ useAirXPaySafe() — Safe Configuration Access

jsx
const config = useAirXPaySafe(); // Returns null if no provider

<div align="center">
Property	Specification	Icon
Returns	object | null	📦
Error	null (no error)	✅
Provider Required	❌ No	🛡️
Null Safety	✅ Yes	🟢
</div>
🎬 Usage Examples

jsx
// 🧪 Component Testing
function TestComponent() {
  const config = useAirXPaySafe();
  return <div>{config?.baseUrl || 'No config'}</div>;
}

// 🔌 Optional Integration
function OptionalFeature() {
  const config = useAirXPaySafe();
  return config && <Feature config={config} />;
}

// 📦 Shared Library Component
function SharedButton() {
  const config = useAirXPaySafe();
  return <button>{config?.publicKey || 'Default'}</button>;
}

🌟 Flexible Choice — Perfect for shared components and testing

<br> <hr> <br>
3️⃣ useProviderReady() — Initialization State

jsx
const isReady = useProviderReady(); // Returns boolean

<div align="center">
Property	Specification	Icon
Returns	boolean	🔄
Error	false (no error)	✅
Provider Required	❌ No	⏳
Use Case	Async state	🎨
</div>
🎬 Usage Examples

jsx
// 🎨 Conditional Rendering
function App() {
  const isReady = useProviderReady();
  return isReady ? <Dashboard /> : <SetupWizard />;
}

// ⏰ Loading States
function PaymentPage() {
  const isReady = useProviderReady();
  if (!isReady) return <LoadingSpinner />;
  return <PaymentForm />;
}

// 🔄 Async Workflows
function DataFetcher() {
  const isReady = useProviderReady();
  useEffect(() => {
    if (isReady) fetchData();
  }, [isReady]);
}

🛡️ Initialization Guardian — Essential for async setup workflows

<br> <hr> <br>
4️⃣ useAirXPayConfig(key) — Targeted Value Access

jsx
const baseUrl = useAirXPayConfig('baseUrl');  // Returns string
const publicKey = useAirXPayConfig('publicKey'); // Returns string

<div align="center">
Property	Specification	Icon
Returns	string | undefined	🎯
Error	undefined (no error)	✅
Params	'baseUrl' | 'publicKey'	🔑
Provider Required	❌ No	🧹
</div>
🎬 Usage Examples

jsx
// 🎯 Single Value Access
function ApiClient() {
  const baseUrl = useAirXPayConfig('baseUrl');
  return fetch(`${baseUrl}/data`);
}

// 🧹 Clean Code
function Header() {
  const publicKey = useAirXPayConfig('publicKey');
  return <Badge>{publicKey?.slice(0, 8)}...</Badge>;
}

// ⚡ Minimal Access
function Logger() {
  const baseUrl = useAirXPayConfig('baseUrl');
  console.log('API URL:', baseUrl);
}

🎯 Precision Tool — When you need just one value, not the whole object

<br> <hr> <br>
📈 Feature Comparison Matrix

Feature	useAirXPay	useAirXPaySafe	useProviderReady	useAirXPayConfig
Return Type	object	object | null	boolean	string
Throws Error	⚠️ Yes	✅ No	✅ No	✅ No
Null Safe	❌ No	✅ Yes	✅ Yes	✅ Yes
Provider Required	✅ Yes	❌ No	❌ No	❌ No
Bundle Size Impact	Low	Low	Lowest	Lowest
Learning Curve	Easy	Easy	Easiest	Easy
Use Case	Full config	Optional config	Init state	Single value
Flexibility	Low	High	High	High
Type Safety	✅ Full	✅ Full	✅ Full	✅ Full
<br> <hr> <br>
🎨 Visual Implementation Guide

jsx
// 🚀 PRODUCTION COMPONENTS - Strict Provider Required
function PaymentProcessor() {
  const { baseUrl, publicKey } = useAirXPay(); // Must have provider
  // Critical payment logic here
}

jsx
// 🧪 REUSABLE COMPONENTS - Flexible Provider Optional
function UIComponent() {
  const config = useAirXPaySafe(); // Safe, handles missing provider
  return <div>{config ? <Connected /> : <Fallback />}</div>;
}

jsx
// ⏰ LOADING MANAGEMENT - Async State Handling
function AppRouter() {
  const isReady = useProviderReady(); // Wait for SDK init
  if (!isReady) return <GlobalLoader />;
  return <AuthenticatedApp />;
}

jsx
// 🎯 CONFIG ACCESS - Focused Value Retrieval
function Analytics() {
  const baseUrl = useAirXPayConfig('baseUrl'); // Only what you need
  const publicKey = useAirXPayConfig('publicKey');
  trackEvent('init', { baseUrl, publicKey });
}
<br> <hr> <br>
🎮 Hook Selection Flowchart

text
                    Start
                      │
                      ▼
            ┌─────────────────┐
            │ Need provider   │
            │   values?       │
            └────────┬────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │  Just one   │         │   Multiple  │
    │   value?    │         │   values?   │
    └─────┬───────┘         └──────┬──────┘
          │                        │
    ┌─────▼─────┐            ┌─────▼─────┐
    │ useAirXPay│            │ Is provider│
    │   Config  │            │ guaranteed?│
    └───────────┘            └─────┬─────┘
                                   │
                       ┌───────────┴───────────┐
                       ▼                       ▼
                 ┌───────────┐           ┌───────────┐
                 │    Yes    │           │    No     │
                 │ useAirXPay│           │useAirXPay │
                 │           │           │   Safe    │
                 └───────────┘           └───────────┘

                    ┌─────────────────┐
                    │ Need init state?│
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │ useProviderReady│
                    └─────────────────┘
<br> <hr> <br>
💡 Pro Tips & Best Practices

Scenario	Recommended Hook	Why
🚀 Core Payment Flow	useAirXPay	Fail fast if provider missing
📦 NPM Package Component	useAirXPaySafe	Don't break consumer apps
⏳ Loading Screen	useProviderReady	Perfect for splash screens
🎯 API URL Only	useAirXPayConfig	Cleaner than destructuring
🧪 Unit Tests	useAirXPaySafe	Mock-friendly
⚡ Performance Critical	useAirXPayConfig	Minimal re-renders
<br> <hr> <br>
📦 Bundle Size Impact

Hook	Size	Impact
useAirXPay	~0.5KB	🟢 Minimal
useAirXPaySafe	~0.5KB	🟢 Minimal
useProviderReady	~0.3KB	🟢 Tiny
useAirXPayConfig	~0.4KB	🟢 Tiny
<br> <hr> <br><div align="center">
⚡ Quick Decision Maker

If you want...	Then use...
🔒 Strict mode, full config	useAirXPay()
🛡️ Safe mode, full config	useAirXPaySafe()
⏰ Check if SDK is ready	useProviderReady()
🎯 Just one config value	useAirXPayConfig(key)
<br> <hr> <br>
🏆 Recommendation Matrix

Use Case	Complexity	Safety	Winner
Production App	High	Strict	useAirXPay
Shared Library	Medium	Safe	useAirXPaySafe
Loading States	Low	Safe	useProviderReady
Config Access	Low	Safe	useAirXPayConfig
<br> <hr> <br>
🎉 Happy Coding!
For questions or support, reach out to the AirXPay team

</div> ```

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
