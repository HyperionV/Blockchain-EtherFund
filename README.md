# EtherFund

A decentralized crowdfunding platform built on Ethereum blockchain.

## Overview

EtherFund is a blockchain-based crowdfunding platform that enables project creators to launch campaigns with transparent, immutable rules encoded in smart contracts. The platform eliminates intermediaries, reduces fees, and provides unprecedented transparency throughout the funding lifecycle.

## Features

- **Campaign Creation**: Deploy crowdfunding campaigns with customizable goals and deadlines
- **ETH Contributions**: Support projects using cryptocurrency
- **Automatic Fund Management**: Smart contracts handle fund release and refunds automatically
- **Transparency**: All transactions are recorded on the blockchain and verifiable by anyone
- **MetaMask Integration**: Seamless wallet connectivity for transactions

## Tech Stack

### Smart Contracts
- Solidity 0.8.20
- Hardhat (development environment)
- OpenZeppelin Contracts (security patterns)

### Backend
- Node.js + TypeScript
- Express.js
- SQLite (better-sqlite3)
- Ethers.js v6

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Ethers.js v6
- TanStack Query

## Project Structure

```
EtherFund/
├── contracts/          # Smart contracts
├── scripts/           # Deployment scripts
├── test/             # Smart contract tests
├── backend/          # Backend API
├── frontend/         # React frontend
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

#### Smart Contracts

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to local network
npm run deploy:local
```

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentation

See the `docs/` directory for detailed documentation:
- Architecture overview
- API documentation
- Smart contract documentation
- Deployment guide

## License

MIT

