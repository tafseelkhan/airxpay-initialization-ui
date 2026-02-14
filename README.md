# AirXPay Flixora SDK - Seller Onboard

<div align="center">
<img src="./assets/images/flixora.png" alt="AirXPay Flixora SDK"/>
</div>

**Enterprise-grade TypeScript SDK** for seamless seller onboarding in multi-tenant SaaS platforms. Built with ❤️ by the **Flixora Ecosystem**. Powered by **AirXPay** for payouts and payments, integrated with **TizzyGo**, **TizzyOS**, and soon **TizzyChat** for real-time notifications. Made with a **smiles-first philosophy**, designed to evolve and upgrade continuously for future generations.

---

# Our team together build AirXPay with Flixora.
*We have changed the version of this package airxpay from v1.0.3 to v1.0.5 because it was our compulsion to match the versions of the apps.*
**I hope you understand. Thanks for your reading.😊❤️**

---
## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Installation](#installation)  
4. [Environment Setup](#environment-setup)  
5. [SDK Initialization](#sdk-initialization)  
6. [API Methods](#api-methods)  
7. [Usage Examples](#usage-examples)  
   - [React / React Native](#react--react-native)  
   - [TypeScript / JavaScript](#typescript--javascript)  
8. [Folder Structure](#folder-structure)  
9. [Advanced Usage](#advanced-usage)  
10. [Error Handling](#error-handling)  
11. [FAQ](#faq)  
12. [Support & Contact](#support--contact)  
13. [License](#license)

---

## 1. Overview

The **AirXPay Flixora SDK - Seller Onboard** is a **robust, future-ready SDK** designed to handle seller creation, KYC document uploads, bank account management, and real-time onboarding status tracking.  

Powered by the **Flixora Ecosystem**:  
- **TizzyGo**: Payment routing & processing  
- **TizzyOS**: Financial OS for SaaS & e-commerce  
- **TizzyChat**: Real-time notifications (coming soon)  

**Key Principles:**  
- Seamless integration  
- Multi-developer SaaS readiness  
- Future-proof architecture  

> "Build once, onboard anywhere – from startups to enterprise SaaS."  

---

## 2. Features

| Feature | Description |
|---------|-------------|
| Seller Creation | Create seller profiles with required metadata |
| KYC Upload | Upload identity documents for verification |
| Bank Integration | Add and update payout bank accounts |
| Status Tracking | Poll for pending or completed onboarding |
| Multi-Tenant Ready | Each developer or tenant isolated via keys |
| TypeScript First | Full type safety & IntelliSense |
| React / React Native Support | Native sheets, modal integration |
| Logging & Retry | Automatic retry, request & response interceptors |
| Security | Data encryption, key validation, rate limiting |

---

## 3. Installation

### npm
```bash
npm install airxpay
````

### yarn

```bash
yarn add airxpay
```

### Peer Dependencies

```bash
npm install axios
```

<div align="center">
<img src="./assets/images/airxpay.png" alt="airxpay"/>
</div>

---

## 4. Environment Setup

Create a `.env` file in your project root:

```env
AIRXPAY_BASE_URL=https://api.airxpay.com
AIRXPAY_PUBLIC_KEY=your_public_key
AIRXPAY_SECRET_KEY=your_secret_key
AIRXPAY_CLIENT_KEY=your_client_key

NODE_ENV=development
APP_NAME=YourApp
```

Load environment variables using `dotenv` (if Node.js):

```ts
import dotenv from 'dotenv';
dotenv.config();
```

---

## 5. SDK Initialization

```ts
import { AirXPay } from 'airxpay';

const sdk = new AirXPay({
  baseUrl: process.env.AIRXPAY_BASE_URL!,
  secretKey: process.env.AIRXPAY_SECRET_KEY!,
  clientKey: process.env.AIRXPAY_CLIENT_KEY!
});
```

---

## 6. API Methods

| Method                              | Description                     |
| ----------------------------------- | ------------------------------- |
| `createSeller(seller, keys)`        | Create a new seller             |
| `updateKyc(sellerId, docs)`         | Upload KYC documents            |
| `updateBank(sellerId, bankDetails)` | Add or update bank info         |
| `getPendingStatus(sellerId)`        | Fetch pending onboarding status |

---

## 7. Usage Examples

### React / React Native

```tsx
import React, { useEffect } from 'react';
import { AirXPay } from 'airxpay';

export const SellerComponent = () => {
  useEffect(() => {
    const sdk = new AirXPay({ 
      baseUrl: process.env.AIRXPAY_BASE_URL!, 
      secretKey: process.env.AIRXPAY_SECRET_KEY!, 
      clientKey: process.env.AIRXPAY_CLIENT_KEY! 
    });

    const seller = {
      sellerName: "Jane Doe",
      sellerEmail: "jane@example.com",
      sellerPhone: "+911234567890",
      businessName: "Jane's Store",
      businessType: "Retail",
      country: "IN"
    };

    const keys = {
      publicKey: process.env.AIRXPAY_PUBLIC_KEY!,
      secretKey: process.env.AIRXPAY_SECRET_KEY!,
      clientKey: process.env.AIRXPAY_CLIENT_KEY!
    };

    sdk.createSeller(seller, keys).then(console.log).catch(console.error);
  }, []);

  return <div>Seller onboarding in progress...</div>;
};
```

### TypeScript / JavaScript (Node.js)

```ts
import { AirXPay } from 'airxpay';

const sdk = new AirXPay({
  baseUrl: process.env.AIRXPAY_BASE_URL!,
  secretKey: process.env.AIRXPAY_SECRET_KEY!,
  clientKey: process.env.AIRXPAY_CLIENT_KEY!
});

const sellerData = { /* seller object */ };
const keys = { /* developer keys */ };

sdk.createSeller(sellerData, keys)
   .then(res => console.log(res))
   .catch(err => console.error(err));
```

---

## 8. Folder Structure

```
airxpay/
├─ src/
│  ├─ index.ts
│  ├─ api/
│  ├─ config/
│  ├─ types/
│  └─ utils/
├─ dist/            # Compiled JS
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 9. Advanced Usage

* Singleton instance for global SDK
* Factory pattern for multi-developer support
* React Native bottom sheet integration
* Automatic retries and interceptors
* Logging & custom error handling

---

## 10. Error Handling

| Status | Meaning      | Recommended Action |
| ------ | ------------ | ------------------ |
| 200    | Success      | Process normally   |
| 400    | Bad Request  | Validate input     |
| 401    | Unauthorized | Refresh keys       |
| 403    | Forbidden    | Check permissions  |
| 404    | Not Found    | Resource missing   |
| 409    | Conflict     | Handle duplicate   |
| 500    | Server Error | Retry request      |

---

## 11. FAQ

* Can I use this in React Native? ✅ Yes
* Do I need TypeScript? ❌ Optional, works with JS too
* Multi-developer support? ✅ Keys are isolated per developer

---

## 12. Support & Contact

* Docs: [https://docs.flixora.com/airxpay](https://docs.flixora.com/airxpay)
* Discord: [https://discord.gg/flixora](https://discord.gg/flixora)
* Email: [support@flixora.com](mailto:support@flixora.com)

---

## 13. License

MIT License © 2026 Flixora Technologies

**Your's Simless Smile😊**
Build with Flixora EcoSystem❤️

---
