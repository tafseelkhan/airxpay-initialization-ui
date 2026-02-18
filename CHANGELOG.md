```markdown
# Changelog

All notable changes to the `@flixora/airxpay-sdk-init-ui` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Initial project setup and configuration
- Core architecture with modular folder structure
- TypeScript support with comprehensive type definitions
- React Native Paper UI components integration
- Expo Linear Gradient for modern UI effects

---

## [1.0.0] - 2026-03-20

### 🚀 Initial Release

#### Added
- **Core Components**
  - `MerchantOnboardingSheet` - Main 5-step onboarding container with animations
  - `BasicDetailsForm` - Step 1: Merchant information collection
  - `KYCVerification` - Step 2: KYC document upload and verification
  - `BankDetails` - Step 3: Bank account details with validation
  - `FinalStepScreen` - Step 4: Review and submit merchant data
  - `OnboardingCompleteScreen` - Step 5: Success screen with status display

- **Context & Providers**
  - `AirXPayProvider` - Global context for SDK configuration
  - `useAirXPay` - Hook for accessing SDK context
  - `useAirXPaySafe` - Safe version with null checks
  - `useProviderReady` - Hook to check provider readiness

- **Custom Hooks**
  - `useMerchantOnboarding` - Complete onboarding logic with API integration
  - `useAirXPaySheet` - Hook for rendering onboarding sheet

- **API Layer**
  - `merchantProxy.ts` - Backend proxy functions
  - `client.ts` - HTTP client with interceptors
  - Token refresh mechanism with queue management
  - Automatic token storage and retrieval

- **Security Features**
  - 🔐 Public key verification before UI rendering
  - 🔐 Backend re-verification for all requests
  - 🔐 Token refresh with queue management
  - 🔐 JWT token validation utilities

- **Validation & Error Handling**
  - `PayloadValidator` - Schema validation for all inputs
  - `ErrorHandler` - Comprehensive error handling with user messages
  - Real-time form validation with field-level errors

- **Utilities**
  - `tokenStorage.ts` - AsyncStorage token management
  - `jwt.ts` - JWT decode and validation
  - `constants.ts` - Centralized constants and UI texts

- **UI/UX Features**
  - Smooth step transitions with animations
  - Progress bar and step indicators
  - Loading states with spinners
  - Status badges (active/suspended/blocked)
  - KYC status display cards
  - Document upload with progress
  - Account number masking
  - IFSC code validation
  - Test mode indicators

- **Types**
  - Comprehensive TypeScript definitions
  - `Merchant`, `KYCDetails`, `BankDetails` interfaces
  - `StepConfig`, `StepCompletion` types
  - `CreateMerchantPayload` and response types

- **Documentation**
  - Comprehensive README with usage examples
  - API reference documentation
  - Security flow documentation

#### Security
- Public key verification before UI render
- Secret key never exposed to frontend
- Token refresh with request queuing
- JWT expiration validation

#### Dependencies
- React 18.0+
- React Native 0.72+
- React Native Paper 5.0+
- Expo Linear Gradient 12.0+
- Async Storage 1.0+
- DateTimePicker 7.0+

---

## [1.0.1] - 2026-03-21

### Fixed
- Fixed import path for `OnboardingCompleteScreen` in main index file
- Corrected `StepCompletion` type to include `final` property
- Fixed `verifyPublicKey` export in merchantProxy
- Resolved TypeScript errors in AirXPayProvider

### Changed
- Updated `FinalStepScreen` import paths for better modularity
- Improved error messages in validation functions

---

## [1.0.2] - 2026-03-22

### Added
- Security verification flow documentation

### Fixed
- Public key verification now properly rejects invalid keys
- Onboarding sheet waits for verification before rendering

### Security
- 🔒 Added timeout protection for verification calls
- 🔒 Error masking to prevent internal exposure

---

## [1.1.0] - 2026-03-23

### Added
- **New Feature**: Auto token refresh with request queue
- **New Feature**: Offline support - cached merchant data
- **New Feature**: Retry mechanism for failed requests

### Changed
- Improved animation performance with native driver
- Optimized re-renders with useCallback and useMemo
- Enhanced error messages for better UX

### Fixed
- Fixed race condition in token refresh
- Fixed memory leak in animations
- Fixed keyboard handling in forms

---

## [1.2.0] - 2026-03-24

### Added
- **New Feature**: Document upload progress indicators
- **New Feature**: File type validation for uploads
- **New Feature**: Test mode indicators with visual badges

### Changed
- Improved KYC document upload flow
- Enhanced bank details validation
- Better error messages for document uploads

### Fixed
- Fixed document removal confirmation dialog
- Fixed progress bar animation glitches
- Fixed form validation on blur

---

## [1.3.0] - 2026-03-25

### Added
- **New Feature**: Custom navigation support in config
- **New Feature**: Environment-based logging (dev/prod)
- **New Feature**: Configurable timeouts for API calls

### Changed
- Improved TypeScript inference for better DX
- Enhanced error boundary handling
- Optimized bundle size with tree shaking

### Deprecated
- `initializeApi` function (use `initializeInternalApi` instead)

---

## [1.4.0] - 2026-03-26

### Added
- **New Feature**: Step persistence - remember completed steps
- **New Feature**: Auto-fetch merchant status on complete screen
- **New Feature**: Refresh button for merchant status

### Changed
- Improved accessibility with ARIA labels
- Better keyboard navigation in forms
- Enhanced RTL language support

### Fixed
- Fixed status badge colors for all states
- Fixed KYC status display in complete screen
- Fixed navigation between steps

---

## [2.0.0] - 2026-04-01

### ⚠️ Breaking Changes

#### Added
- **Major**: Complete rewrite with 5-step flow (previously 4 steps)
- **Major**: New `FinalStepScreen` component for review and submit
- **Major**: Step 4 (Final Review) added between Bank and Complete

#### Changed
- `StepCompletion` interface now requires `final: boolean` property
- `STEPS` array updated from 4 to 5 steps
- `validateStepData` now checks step 4 (final review)

#### Migration Guide
```typescript
// Old (1.x) - 4 steps
const STEPS = [basic, kyc, bank, complete];

// New (2.0) - 5 steps
const STEPS = [basic, kyc, bank, final, complete];

// Update StepCompletion type
interface StepCompletion {
  basic: boolean;
  kyc: boolean;
  bank: boolean;
  final: boolean;  // ✅ Add this
}
```

---

## [2.0.1] - 2026-04-02

### Fixed
- Fixed TypeScript errors in StepCompletion type
- Fixed import paths in main index file
- Fixed final step navigation logic

---

## [2.1.0] - 2026-04-03

### Added
- **New Feature**: Document compression before upload
- **New Feature**: Network status detection
- **New Feature**: Automatic retry on network failure

### Changed
- Improved offline error handling
- Better loading states with skeletons
- Enhanced form validation messages

### Fixed
- Fixed memory issues in file uploader
- Fixed race condition in network detection
- Fixed token refresh on slow networks

---

## [2.2.0] - 2026-04-04

### Added
- **New Feature**: Session timeout handling
- **New Feature**: Multi-language support foundation

### Security
- 🔒 Added request signing for sensitive operations
- 🔒 Enhanced token encryption at rest

---

## [3.0.0] - 2026-04-10

### ⚠️ Major Release - Security Focus

#### Security
- 🔒 **CRITICAL**: Added backend public key verification
- 🔒 **CRITICAL**: Double verification (frontend + backend)
- 🔒 **CRITICAL**: Reject all requests with invalid public keys
- 🔒 Added request signing for all API calls
- 🔒 Enhanced JWT validation with expiration checks

#### Added
- `verifyPublicKey` function in merchantProxy
- Security documentation in README

#### Changed
- Onboarding sheet now waits for verification
- All API calls now require valid public key
- Enhanced error messages for security failures

---

## [3.0.1] - 2026-04-11

### Fixed
- Fixed public key verification timeout issues
- Fixed error handling in verification flow
- Fixed TypeScript definitions for new security features

---

## [4.0.0] - 2026-04-15 - CURRENT VERSION

### 🎉 **MAJOR RELEASE - FlixoraEncrypted Vault** 🔐

#### Added - **🔐 SECURE KEY VAULT**
- **NEW**: `FlixoraEncrypted` - AES-256-GCM encryption module
- **NEW**: Auto-encryption of all sensitive keys (secretKey, clientKey)
- **NEW**: 1-minute auto re-encryption cycle
- **NEW**: Memory-safe operations with buffer zeroing
- **NEW**: Flexible key naming - developer can use ANY name in `process.flixora`
- **NEW**: Multiple configuration support (Production, Testing, Staging)
- **NEW**: Automatic key loading from `process.flixora`
- **NEW**: No console.log exposure of keys
- **NEW**: Access logging for audit without exposing values

#### Added - **Core Features**
- **NEW**: `secure/` folder with complete vault implementation
- **NEW**: `FlixoraEncrypted` class with singleton pattern
- **NEW**: `createSecureVault()` factory function
- **NEW**: TypeScript definitions for all vault operations

#### Changed
- **Updated**: `ConfigManager` now integrates with vault
- **Updated**: `merchantProxy.ts` fetches keys from vault
- **Updated**: `initializeInternalApi()` auto-loads from `process.flixora`
- **Updated**: `getSecretKey()` and `getClientKey()` now check vault first

#### Security Enhancements
- 🔐 **AES-256-GCM** - Military-grade encryption
- 🔐 **Auto-Encryption** - Keys re-encrypt every 60 seconds
- 🔐 **Memory Safe** - Buffers zeroed after use
- 🔐 **No Logging** - Keys never appear in console
- 🔐 **Flexible Names** - Use ANY key name in `process.flixora`
- 🔐 **Multiple Configs** - Support for different environments

#### Developer Experience
- ✅ **Simple Setup** - Just define `process.flixora.ANY_NAME`
- ✅ **Automatic** - Keys auto-load, auto-encrypt, auto-decrypt
- ✅ **Zero Config** - No manual encryption/decryption needed
- ✅ **Type Safe** - Full TypeScript support

#### Migration Guide from v3.x to v4.0

```typescript
// v3.x - Old way
process.flixora = {
  AirXPay: {  // Fixed name
    publicKey: 'pk_123',
    secretKey: 'sk_456'
  }
};

// v4.0 - New way (ANY NAME!)
process.flixora = {
  MyBusinessApp: {  // 👈 Koi bhi naam
    publicKey: 'pk_123',
    secretKey: 'sk_456',   // 🔐 Auto-encrypted
    clientKey: 'ck_789'     // 🔐 Auto-encrypted
  }
};

// Multiple environments
process.flixora = {
  Production: {
    publicKey: 'pk_live_111',
    secretKey: 'sk_live_222'
  },
  Testing: {
    publicKey: 'pk_test_333',
    secretKey: 'sk_test_444'
  }
};
```

---

## [4.0.1] - 2026-04-16

### Fixed
- Fixed TypeScript errors in AirXPayConfig interface
- Added missing properties to AirXPayConfig (environment, autoRefreshToken, tokenRefreshThreshold)
- Fixed `loadKeysFromProcess()` to handle any key name dynamically
- Resolved build issues with process.flixora type declarations

---

## [4.1.0] - 2026-04-17

### Added
- **New Feature**: Dark mode support
- **New Feature**: Custom theme support
- **New Feature**: Font scaling accessibility
- **New Feature**: Enhanced vault logging (non-sensitive)

### Changed
- Improved vault performance
- Better memory management
- Enhanced error messages

---

## Current Version

**Latest Stable:** `4.1.0` (April 17, 2026)

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| **4.1.0** | 2026-04-17 | Dark mode, custom themes, vault enhancements |
| **4.0.1** | 2026-04-16 | TypeScript fixes, dynamic key loading |
| **4.0.0** | 2026-04-15 | 🎉 **FlixoraEncrypted Vault** - AES-256, auto-encryption, flexible key names |
| 3.0.0 | 2026-04-10 | Security focus, double verification |
| 2.0.0 | 2026-04-01 | 5-step flow, final review screen |
| 1.0.0 | 2026-03-20 | Initial release |

---

## 🚀 Upgrade Guide

### From v3.x to v4.x

```bash
npm install @flixora/airxpay-sdk-init-ui@latest
```

No breaking changes in API! Just better security:

```javascript
// ✅ Still works
process.flixora.AirXPay = { ... }

// ✅ Better: Use any name!
process.flixora.MyApp = { ... }
```

---

## Contributors

- Tafseel Khan ([@tafseelkhan](https://github.com/tafseelkhan)) - Lead Developer
- Flixora Engineering Team
- Community Contributors

---

## Support

For issues and feature requests, please [open an issue](https://github.com/flixora/airxpay-sdk-init-ui/issues) on GitHub.

---

**Full Changelog**: [https://github.com/flixora/airxpay-sdk-init-ui/compare/v1.0.0...v4.1.0](https://github.com/flixora/airxpay-sdk-init-ui/compare/v1.0.0...v4.1.0)

---

<div align="center">
  <sub>Copyright © 2026 Flixora. All rights reserved.</sub>
  <br/>
  <sub>Made with ❤️ for the developer community</sub>
</div>
```

---

## ✅ Summary of Changes Made

| Section | Changes |
|---------|---------|
| **v4.0.0** | Added complete FlixoraEncrypted vault details |
| **v4.0.1** | Fixed TypeScript errors and dynamic key loading |
| **v4.1.0** | Added dark mode and vault enhancements |
| **Migration Guide** | Added clear upgrade instructions |
| **Version History** | Updated with latest versions |
| **Footer** | Updated copyright to Flixora |
