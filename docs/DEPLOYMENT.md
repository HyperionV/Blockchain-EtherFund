# Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask browser extension
- Ethereum testnet account (for Sepolia deployment)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

Create `.env` file in root directory:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
FACTORY_CONTRACT_ADDRESS=
```

### 3. Start Local Blockchain

**IMPORTANT:** You must start the local blockchain BEFORE deploying contracts.

Open a **new terminal window** and run:

```bash
npx hardhat node
```

This starts a local Hardhat network on `http://localhost:8545` with 20 test accounts.

**Keep this terminal running** - the node must stay active for deployments and testing.

### 4. Deploy Contracts

**⚠️ IMPORTANT:** If you restarted the Hardhat node, you **MUST** clear the database first:

```bash
npm run clear-db
```

This removes old campaign data that points to non-existent contracts.

Then deploy:

```bash
npm run deploy:local
```

**Note:** If you get "Cannot connect to network localhost", make sure step 3 is running in a separate terminal.

Copy the factory address and update `.env`:

```env
FACTORY_CONTRACT_ADDRESS=0x...
```

Also update `frontend/.env`:

```env
VITE_FACTORY_CONTRACT_ADDRESS=0x...
```

### 5. Start Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:3001`.

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Testnet Deployment

### 1. Deploy Contracts to Sepolia

```bash
npm run deploy:sepolia
```

### 2. Verify Contracts (Optional)

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 3. Update Environment Variables

Update `.env` files with testnet contract addresses.

## Production Deployment

### Backend Deployment

1. Build the backend:

```bash
cd backend
npm run build
```

2. Deploy to cloud service (Railway, Render, etc.)
3. Set environment variables:
   - `PORT`
   - `DATABASE_PATH`
   - `FACTORY_CONTRACT_ADDRESS`
   - `NODE_ENV=production`

### Frontend Deployment

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Deploy `dist/` folder to Vercel, Netlify, or similar
3. Set environment variables:
   - `VITE_API_URL`
   - `VITE_FACTORY_CONTRACT_ADDRESS`

## Database Migration

The database is automatically initialized on first run. The SQLite database file will be created at the path specified in `DATABASE_PATH` environment variable.

## ⚠️ IMPORTANT: What Persists and What Resets

### When You Restart the Hardhat Node

**IMPORTANT:** Hardhat's local blockchain (`npx hardhat node`) does **NOT** persist state between restarts. When you stop and restart the node, the blockchain state is completely reset.

#### What CHANGES (Resets):

1. **Factory Contract Address** ❌

   - **Changes every time** you deploy
   - You must update `.env` files with the new factory address after each deployment
   - Old factory address becomes invalid

2. **All Campaign Contracts** ❌

   - **All campaign contracts are LOST** when the node restarts
   - Contract addresses in your database become invalid
   - Campaign metadata (title, description) in database persists, but blockchain data is lost
   - You'll need to create new campaigns after restarting

3. **Account Balances** ❌

   - **Reset to 10,000 ETH** for each account
   - All transaction history is lost
   - Any ETH you sent or received is reset

4. **Transaction History** ❌
   - All blocks and transactions are lost
   - Block numbers reset to 0

#### What STAYS THE SAME (Persists):

1. **Account Addresses** ✅

   - Account addresses remain the **same** (deterministic generation)
   - Account #0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - Account #1: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - ... and so on
   - Private keys remain the same

2. **Account Private Keys** ✅

   - Private keys stay the same (deterministic)
   - You can re-import the same accounts in MetaMask

3. **Database Records** ✅

   - SQLite database file persists
   - Campaign metadata (title, description, goal, deadline) remains in database
   - **However:** Contract addresses in database become invalid
   - Contribution records remain but point to non-existent contracts

4. **Environment Variables** ✅
   - `.env` files persist (but need updating with new factory address)

### Workflow After Restarting Hardhat Node

**⚠️ CRITICAL:** When you restart the Hardhat node, all contracts are lost. You must clear the database before deploying new contracts.

1. **Start Hardhat Node:**

   ```bash
   npx hardhat node
   ```

2. **Clear Database (REQUIRED):**

   ```bash
   npm run clear-db
   ```

   **Why?** Old campaign records in the database point to contracts that no longer exist. These must be cleared before deploying new contracts.

3. **Deploy Factory Contract:**

   ```bash
   npm run deploy:local
   ```

   This will:

   - Deploy the new factory contract
   - Show you the new factory address

4. **Update Environment Variables:**

   - Copy the new factory address from deployment output
   - Update `FACTORY_CONTRACT_ADDRESS` in root `.env`
   - Update `VITE_FACTORY_CONTRACT_ADDRESS` in `frontend/.env`

5. **Backend Warning:**

   - When you start the backend, it will check if the factory contract exists
   - If the contract is missing, you'll see a **warning message**:
     ```
     ⚠️  WARNING: Factory contract not found on blockchain!
     ⚠️  This usually means the Hardhat node was restarted.
     ⚠️  ACTION REQUIRED: Run 'npm run clear-db' before deploying new contracts.
     ```
   - This is a reminder to clear the database before deploying

6. **Create New Campaigns:**
   - Create new campaigns through the frontend
   - New contracts will be deployed with valid addresses

### Why This Happens

Hardhat's local node is an **ephemeral blockchain** - it's designed for development and testing. It doesn't save state to disk, so every restart creates a fresh blockchain. This is different from:

- **Testnets (Sepolia, Goerli):** Contracts persist permanently
- **Mainnet:** Contracts persist permanently
- **Production blockchains:** State is stored permanently

### Best Practices

1. **Keep Hardhat Node Running:** Don't restart it during development sessions
2. **Save Factory Address:** Copy it immediately after deployment
3. **Use Testnets for Persistence:** Deploy to Sepolia if you need contracts to persist
4. **Document Your Setup:** Note down factory addresses if you need to reference them later

## Troubleshooting

### MetaMask Connection Issues

- Ensure MetaMask is installed
- Check network matches (localhost:8545 for local, Sepolia for testnet)
- Reset MetaMask account if needed

### Contract Not Found

- Verify factory address is correct
- Ensure contracts are deployed to the correct network
- Check network ID matches

### API Connection Errors

- Verify backend is running
- Check CORS settings
- Verify API URL in frontend environment variables
