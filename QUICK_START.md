# Quick Start Guide

## Step-by-Step Local Deployment

### 1. Install Dependencies

```bash
# Root directory
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Start Local Blockchain Network

**Open a new terminal window** and run:

```bash
npx hardhat node
```

This will start a local Hardhat network on `http://localhost:8545` with 20 test accounts pre-funded with ETH.

**Keep this terminal running** - don't close it!

### 4. Deploy Contracts

**In your original terminal** (or a new one), run:

```bash
npm run deploy:local
```

This will deploy the CampaignFactory contract and output the contract address.

### 5. Update Environment Variables

**IMPORTANT:** Copy the factory address from the deployment output!

Create `frontend/.env` file (if it doesn't exist):

```env
VITE_FACTORY_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_API_URL=http://localhost:3001
```

**Replace `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` with YOUR actual factory address from deployment!**

Also create root `.env` (optional, for backend):

```env
FACTORY_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### 6. Start Backend

**In a new terminal:**

```bash
cd backend
npm run dev
```

### 7. Start Frontend

**In another new terminal:**

```bash
cd frontend
npm run dev
```

### 8. Connect MetaMask

1. **Add Local Network to MetaMask:**

   - Open MetaMask extension
   - Click network dropdown (top of MetaMask)
   - Click "Add Network" or "Add a network manually"
   - Enter:
     - **Network Name:** `Hardhat Local`
     - **RPC URL:** `http://localhost:8545`
     - **Chain ID:** `1337`
     - **Currency Symbol:** `ETH`
   - Click "Save"
   - **Switch to this network** (important!)

2. **Import Test Account:**

   - In MetaMask, click account icon (top right)
   - Click "Import Account"
   - Paste one of the private keys from Hardhat node terminal
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Click "Import"

3. **Connect to App:**
   - Go to http://localhost:3000
   - Click "Connect Wallet" button
   - Approve connection in MetaMask popup
   - You should see your address in the header

**Troubleshooting:** If MetaMask keeps loading, see `TROUBLESHOOTING.md`

## Troubleshooting

**"Cannot connect to network localhost"**

- Make sure `npx hardhat node` is running in a separate terminal
- Check that it's listening on port 8545

**"Contract not found"**

- Verify the factory address in `.env` files matches the deployment output
- Make sure you're on the correct network (localhost:8545)

**"MetaMask connection failed"**

- Ensure MetaMask is installed
- Check that you've added the local network
- Verify the network chain ID is 1337
