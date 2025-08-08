# 🎨 Cultural NFT Smart Contracts

This directory contains the smart contracts for the Cultural NFT Marketplace built on Hedera Hashgraph.

## 📋 Contract Overview

### 🎭 CulturalNFT.sol
The main NFT contract that handles:
- **Minting**: Create cultural NFTs with rich metadata
- **Royalties**: Built-in royalty system for artists
- **Likes**: Community appreciation system with HBAR rewards
- **Cultural Data**: Store cultural significance and stories

### 🏪 CulturalMarketplace.sol
The marketplace contract that manages:
- **Fixed Price Sales**: Direct purchase of NFTs
- **Auctions**: Time-limited bidding system
- **Bid Management**: Automatic refunds and winner selection
- **Fee Distribution**: Platform fees and royalty payments

### 🏆 CommunityRewards.sol
The rewards system that tracks:
- **User Points**: Gamified engagement system
- **Tier System**: Bronze, Silver, Gold, Diamond levels
- **Like History**: Complete record of user interactions
- **Reward Distribution**: Community pool management

## 🚀 Deployment

### Prerequisites
\`\`\`
npm install
cp .env.example .env
# Fill in your environment variables
\`\`\`

### Deploy to Hedera Testnet
\`\`\`
npm run deploy:testnet
\`\`\`

### Deploy to Hedera Mainnet
\`\`\`
npm run deploy:mainnet
\`\`\`

### Verify Contracts
\`\`\`
npm run verify
\`\`\`

## 🔧 Environment Variables

\`\`\`env
# Hedera Network Configuration
PRIVATE_KEY=your_private_key_here
COMMUNITY_WALLET=0x1234567890123456789012345678901234567890

# Hedera Account IDs (for SDK operations)
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your_hedera_private_key_here

# Network URLs
HEDERA_TESTNET_URL=https://testnet.hashio.io/api
HEDERA_MAINNET_URL=https://mainnet.hashio.io/api

# IPFS Configuration (for metadata storage)
IPFS_PROJECT_ID=your_infura_ipfs_project_id
IPFS_PROJECT_SECRET=your_infura_ipfs_secret
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Contract Verification
HASHSCAN_API_KEY=test

\`\`\`

## 📊 Contract Addresses

After deployment, contract addresses will be saved to:
- `deployments/hedera-testnet.json`
- `deployments/hedera-mainnet.json`
- Frontend `.env.local` file (automatically updated)

## 🧪 Testing

\`\`\`
npm test
\`\`\`

## 📖 Contract Documentation

### Minting an NFT
```solidity
function mintCulturalNFT(
    address to,
    string memory tokenURI,
    string memory culture,
    string memory artist,
    string memory story,
    uint96 royaltyPercent
) public payable returns (uint256)
