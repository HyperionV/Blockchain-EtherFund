# EtherFund Architecture

## Overview

EtherFund is a decentralized crowdfunding platform built on Ethereum blockchain. The architecture consists of three main layers:

1. **Smart Contracts Layer** - On-chain logic for campaign management
2. **Backend API Layer** - Off-chain data storage and blockchain interaction
3. **Frontend Layer** - User interface and Web3 integration

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Components  │  │  Web3 Context│  │  API Client  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │                    │
                            │                    │
                    ┌───────▼────────┐   ┌───────▼────────┐
                    │  Backend API   │   │   MetaMask     │
                    │   (Express)    │   │   (Wallet)     │
                    └───────┬────────┘   └────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│   SQLite DB    │  │  Blockchain    │  │  Ethers.js     │
│   (Metadata)   │  │   Service       │  │  (Web3)        │
└────────────────┘  └─────────────────┘  └────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Ethereum      │
                    │  Blockchain    │
                    │  (Smart        │
                    │   Contracts)   │
                    └────────────────┘
```

## Component Details

### Smart Contracts

**Campaign.sol**
- Individual campaign contract
- Manages contributions, withdrawals, and refunds
- Uses OpenZeppelin's ReentrancyGuard and Ownable

**CampaignFactory.sol**
- Factory pattern for deploying Campaign instances
- Tracks all deployed campaigns

### Backend API

**Technology Stack:**
- Node.js + TypeScript
- Express.js
- SQLite (better-sqlite3)
- Ethers.js v6

**Key Components:**
- Database layer with direct SQL queries
- Blockchain service for contract interactions
- RESTful API endpoints
- Request validation with Zod

### Frontend

**Technology Stack:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Ethers.js v6
- TanStack Query

**Key Components:**
- Web3Context for wallet management
- React Query for data fetching
- Component-based architecture
- Responsive design

## Data Flow

### Campaign Creation Flow

1. User fills form in frontend
2. Frontend calls MetaMask to deploy contract via Factory
3. Contract address returned to frontend
4. Frontend sends campaign metadata to backend API
5. Backend stores metadata in SQLite database

### Contribution Flow

1. User enters contribution amount
2. Frontend calls contract's `contribute()` function
3. Transaction confirmed on blockchain
4. Frontend optionally syncs with backend
5. Backend can index contributions from blockchain events

### Withdrawal Flow

1. Creator clicks withdraw button
2. Frontend calls contract's `withdraw()` function
3. Contract validates goal reached and transfers funds
4. Transaction confirmed on blockchain

### Refund Flow

1. Contributor clicks refund button
2. Frontend calls contract's `refund()` function
3. Contract validates deadline passed and goal not reached
4. Funds transferred back to contributor

## Security Considerations

- Smart contracts use OpenZeppelin security patterns
- Reentrancy protection on all state-changing functions
- Access control for withdrawals
- Input validation on both frontend and backend
- SQL injection prevention through parameterized queries

## Deployment

### Smart Contracts
- Deploy to testnet (Sepolia) or local Hardhat network
- Verify contracts on Etherscan
- Store factory address in environment variables

### Backend
- Deploy to cloud service (Railway, Render, etc.)
- Configure database path
- Set environment variables

### Frontend
- Build static files with Vite
- Deploy to Vercel, Netlify, or similar
- Configure API URL and contract addresses

