# CHANGELOG

## [2025-07-22]
### Added
- Ensured all React Native, Expo, and frontend code is in `greenmint-mob`.
- Updated contractHelpers to use deployed Amoy address.
- Updated .env for Amoy testnet integration.

### Updated
- Marketplace screen to fetch and display on-chain products.

### Issues Resolved
- Prevented blockchain/Hardhat code from being mixed with frontend/mobile code.

### Affected Files
- app/(tabs)/market.tsx
- utils/contractHelpers.ts
- .env
- README.md
