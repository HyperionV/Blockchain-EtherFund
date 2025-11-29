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

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Blockchain-EtherFund
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Install MetaMask:**
   - Download from [metamask.io](https://metamask.io)
   - Install the browser extension
   - Create or import a wallet

### Quick Start

#### 1. Start Local Blockchain

Open a **new terminal** and start the Hardhat node:

```bash
npx hardhat node
```

**Keep this terminal running** - the node must stay active.

This starts a local Ethereum network on `http://localhost:8545` with 20 test accounts, each with 10,000 ETH.

#### 2. Deploy Contracts

**⚠️ IMPORTANT:** If you restarted the Hardhat node, clear the database first:

```bash
npm run clear-db
```

Then deploy the factory contract:

```bash
npm run deploy:local
```

Copy the **factory** address from the output and update your `.env` files:

**Root `.env`:**

```env
FACTORY_CONTRACT_ADDRESS=0x...  # Your factory address
```

**`frontend/.env`:**

```env
VITE_FACTORY_CONTRACT_ADDRESS=0x...  # Your factory address
VITE_API_URL=http://localhost:3001
```

#### 3. Configure MetaMask

1. **Add Local Network:**

   - Open MetaMask
   - Click network dropdown → "Add Network" or "Add a network manually"
   - Enter:
     - **Network Name:** `Hardhat Local`
     - **RPC URL:** `http://localhost:8545`
     - **Chain ID:** `1337`
     - **Currency Symbol:** `ETH`
   - Click "Save"
   - Switch to this network

2. **Import Test Account:**
   - In MetaMask, click account icon → "Import Account"
   - Paste a private key from the Hardhat node terminal (Account #0 recommended)
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Click "Import"

#### 4. Start Backend

In a **new terminal**:

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:3001`.

**Note:** If you see warnings about missing contracts, you may need to clear the database and redeploy.

#### 5. Start Frontend

In a **new terminal**:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`.

#### 6. Connect and Use

1. Open `http://localhost:3000` in your browser
2. Click "Connect Wallet" and approve in MetaMask
3. Create campaigns, contribute, and manage funds!

### Development Commands

#### Smart Contracts

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to local network
npm run deploy:local

# Clear database (before deploying after Hardhat restart)
npm run clear-db
```

#### Backend

```bash
cd backend
npm run dev      # Development server
npm run build    # Build for production
npm run clear-db # Clear database manually
```

#### Frontend

```bash
cd frontend
npm run dev      # Development server
npm run build    # Build for production
```

## Important Notes

### Hardhat Node Restart

**⚠️ CRITICAL:** When you restart the Hardhat node, all contracts are lost. You must:

1. Clear the database: `npm run clear-db`
2. Deploy new contracts: `npm run deploy:local`
3. Update environment variables with the new factory address

The backend will show a warning if it detects missing contracts.

### What Persists vs. What Resets

**Resets (lost on Hardhat restart):**

- Factory contract address
- All campaign contracts
- Account balances (reset to 10,000 ETH)
- Transaction history

**Persists:**

- Account addresses (same every time)
- Account private keys
- Database records (but contract addresses become invalid)
- Environment variable files

See `docs/DEPLOYMENT.md` for complete details.

## Documentation

See the `docs/` directory for detailed documentation:

- `QUICK_START.md` - Quick setup guide
- `docs/DEPLOYMENT.md` - Complete deployment guide
- `docs/ARCHITECTURE.md` - System architecture
- `docs/API.md` - API documentation
- `docs/SMART_CONTRACTS.md` - Smart contract details
- `docs/TROUBLESHOOTING.md` - Common issues and solutions

## License

MIT
