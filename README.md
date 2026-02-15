## 📘 AirXPay Initialization UI Components

<div align="center">
<img src="./assets/images/flixora.png" alt="AirXPay Flixora SDK"/>
</div>

---

## AirXPay Initialization UI is a React & React Native component library to simplify seller onboarding in your apps. It provides ready-to-use steps for Basic Details, KYC Verification, Bank Details, and Completion, with smooth animations, progress tracking, and validation built-in.

**Enterprise-grade TypeScript SDK** for seamless seller onboarding in multi-tenant SaaS platforms. Built with ❤️ by the **Flixora Ecosystem**. Powered by **AirXPay** for payouts and payments, integrated with **TizzyGo**, **TizzyOS**, and soon **TizzyChat** for real-time notifications. Made with a **smiles-first philosophy**, designed to evolve and upgrade continuously for future generations.

---

# Our team together build AirXPay with Flixora.

_We have changed the version of this package airxpay from v1.0.3 to v1.0.5 because it was our compulsion to match the versions of the apps._
**I hope you understand. Thanks for your reading.😊❤️**

---

🔹 Features

Multi-step seller onboarding UI

Step validation and completion tracking

Animated step transitions

Integrated KYC & Bank Details checks

Loading and submission states

Compatible with React Native Paper, Expo, and React 18+

Configurable AirXPayProvider for API integration

Fully typed with TypeScript

Modular and reusable components

📦 Installation

Ensure you are inside your React Native / Expo project:

npm install react-native react-native-paper react-native-country-picker-modal expo-image-picker expo-linear-gradient

Or with Yarn:

yarn add react-native react-native-paper react-native-country-picker-modal expo-image-picker expo-linear-gradient

Then, install the UI package (if you are using it locally):

npm install --save path/to/airxpay-initialization-ui

🛠️ Prerequisites

React 18+

React Native >= 0.72

Expo SDK (optional if using expo packages like LinearGradient or ImagePicker)

---

<div align="center">
<img src="./assets/images/airxpay.png" alt="airxpay"/>
</div>

---

🏗️ Usage
1️⃣ Wrap your app in AirXPayProvider

All components rely on AirXPayProvider to access configuration like baseUrl and publicKey.

import React from 'react';
import { AirXPayProvider } from 'airxpay-initialization-ui';
import App from './App';

export default function Root() {
return (
<AirXPayProvider
config={{
        baseUrl: 'https://api.airxpay.com',
        publicKey: 'YOUR_PUBLIC_KEY_HERE',
      }} >
<App />
</AirXPayProvider>
);
}

2️⃣ Render SellerOnboardingSheet
import React from 'react';
import SellerOnboardingSheet from 'airxpay-initialization-ui/components/SellerOnboardingSheet';

const MySellerOnboarding = () => {
return (
<SellerOnboardingSheet
sellerId="12345"
mode="live"
isKycCompleted={false}
isBankDetailsCompleted={false}
kycStatus="pending"
status="pending"
onNext={(stepData, currentStep) => {
console.log('Step completed:', currentStep, stepData);
}}
onBack={(currentStep) => {
console.log('Went back from step:', currentStep);
}}
onComplete={(sellerData) => {
console.log('Seller onboarding complete!', sellerData);
}}
/>
);
};

export default MySellerOnboarding;

🔹 Props
Prop Type Required Description
sellerId string ✅ Unique ID of the seller
mode `'live'	'test'` ✅
isKycCompleted boolean ✅ Whether KYC is already completed
isBankDetailsCompleted boolean ✅ Whether bank details are completed
kycStatus string ✅ Current KYC status (pending / verified)
status string ✅ Seller status (pending / active)
initialStep number ❌ Step to start from (default 1)
initialData Partial<Seller> ❌ Pre-filled seller data
onNext (stepData: Partial<Seller>, currentStep: number) => void ✅ Callback after completing a step
onBack (currentStep: number) => void ✅ Callback when going back a step
onComplete (sellerData: Seller) => void ✅ Callback when onboarding completes
loading boolean ❌ Show external loading state
🔹 Step Components

BasicDetailsForm – Collect seller name, email, and phone

KYCVerification – Upload KYC documents, verify identity

BankDetails – Add bank account information

OnboardingComplete – Show success state with animation

🎨 Customization

Logo: Change DEFAULT_LOGO in SellerOnboardingSheet or pass a custom logo prop

Colors & Gradients: Modify LinearGradient and StyleSheet colors

Step Icons: Each step can have a custom icon via STEPS array

⚙️ AirXPayProvider Configuration
export interface AirXPayConfig {
baseUrl: string; // API base URL
publicKey: string; // API public key
}

Validation occurs on mount

Invalid config will throw an error in dev mode

useAirXPay() hook provides config safely

📌 Hooks
Hook Description
useAirXPay() Returns AirXPay config, throws if provider missing
useAirXPaySafe() Returns AirXPay config or null if missing
useAirXPayConfig(key) Access single config value (baseUrl or publicKey)
useIsAirXPayReady() Returns true if provider has valid config
💡 Notes

Always wrap your component tree with <AirXPayProvider>

KYC & Bank steps are required in live mode

Animations are optimized for React Native, avoid heavy operations in step callbacks

Compatible with Expo managed workflow

🚀 Example Project Structure
/airxpay-initialization-ui
/components
/steps
BasicDetailsForm.tsx
KYCVerification.tsx
BankDetails.tsx
OnboardingComplete.tsx
SellerOnboardingSheet.tsx
/contexts
AirXPayProvider.tsx
/api
seller.ts
index.ts

## 13. License

MIT License © 2026 Flixora Technologies

**Your's Simless Smile😊**
Build with Flixora EcoSystem❤️

---
