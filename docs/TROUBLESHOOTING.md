# Troubleshooting Guide

## MetaMask Connection Issues

### Problem: MetaMask keeps loading / won't connect

**Common Causes:**

1. **Missing Factory Contract Address**
   - The frontend needs the factory contract address to work
   - Check if `frontend/.env` exists and has the correct address

2. **Wrong Network in MetaMask**
   - MetaMask must be connected to the local Hardhat network
   - Network settings:
     - Network Name: Hardhat Local
     - RPC URL: http://localhost:8545
     - Chain ID: 1337
     - Currency Symbol: ETH

3. **Hardhat Node Not Running**
   - The local blockchain must be running
   - Check terminal where you ran `npx hardhat node`
   - Should see "Started HTTP and WebSocket JSON-RPC server"

### Solution Steps:

1. **Verify Hardhat Node is Running**
   ```bash
   # Should see output like:
   # Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
   ```

2. **Check Environment Variables**
   
   Create `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_FACTORY_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
   ```
   
   **Important:** Use the address from your latest deployment!

3. **Restart Frontend**
   ```bash
   # Stop the frontend (Ctrl+C)
   # Then restart:
   cd frontend
   npm run dev
   ```

4. **Configure MetaMask Network**
   
   - Open MetaMask
   - Click network dropdown (top)
   - Click "Add Network" or "Add a network manually"
   - Enter:
     - Network Name: `Hardhat Local`
     - RPC URL: `http://localhost:8545`
     - Chain ID: `1337`
     - Currency Symbol: `ETH`
   - Click "Save"
   - Switch to this network

5. **Import Test Account**
   
   - In MetaMask, click account icon (top right)
   - Click "Import Account"
   - Paste one of the private keys from Hardhat node output
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Click "Import"

6. **Try Connecting Again**
   - Refresh the frontend page
   - Click "Connect Wallet"
   - Approve connection in MetaMask

---

## "Calling an account which is not a contract" Warnings

**What this means:**
- The frontend is trying to call addresses that aren't smart contracts
- Usually happens when:
  - Factory address is wrong or empty
  - Frontend tries to load campaigns before contracts exist
  - Wrong network selected

**Solution:**
1. Verify factory address in `frontend/.env` matches deployment
2. Make sure you're on the correct network (Chain ID 1337)
3. Restart frontend after updating .env

---

## Backend Connection Issues

### Problem: Frontend can't reach backend API

**Check:**
1. Backend is running: `cd backend && npm run dev`
2. Backend URL in `frontend/.env`: `VITE_API_URL=http://localhost:3001`
3. No CORS errors in browser console

---

## Contract Deployment Issues

### Problem: "Cannot connect to network localhost"

**Solution:**
1. Start Hardhat node first: `npx hardhat node`
2. Keep it running in a separate terminal
3. Then deploy: `npm run deploy:local`

---

## Hardhat Node Restart Issues

### Problem: Backend shows warnings about missing contracts or "Contract not found" errors

**What happened:**
- You restarted the Hardhat node
- All contracts on the blockchain were lost (this is normal - Hardhat doesn't persist state)
- Your database still has old campaign records pointing to non-existent contracts

**Solution:**

1. **Clear the database:**
   ```bash
   npm run clear-db
   ```
   This removes all old campaign data that points to invalid contracts.

2. **Deploy new contracts:**
   ```bash
   npm run deploy:local
   ```

3. **Update environment variables:**
   - Copy the new factory address from deployment output
   - Update `FACTORY_CONTRACT_ADDRESS` in root `.env`
   - Update `VITE_FACTORY_CONTRACT_ADDRESS` in `frontend/.env`

4. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

**Prevention:**
- Always run `npm run clear-db` before deploying after restarting Hardhat node
- The backend will show a warning on startup if it detects missing contracts

**Note:** The backend will display a warning message when it detects that the factory contract is missing. This is your reminder to clear the database.

---

## Quick Checklist

Before starting:
- [ ] Hardhat node is running (`npx hardhat node`)
- [ ] **If restarted Hardhat node:** Database cleared (`npm run clear-db`)
- [ ] Contracts are deployed (`npm run deploy:local`)
- [ ] Factory address copied to `frontend/.env`
- [ ] Backend is running (`cd backend && npm run dev`)
- [ ] Frontend is running (`cd frontend && npm run dev`)
- [ ] MetaMask has local network configured (Chain ID 1337)
- [ ] MetaMask has test account imported
- [ ] MetaMask is connected to local network

---

## Still Having Issues?

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for error messages
   - Share error details

2. **Check Network Tab**
   - See if API calls are failing
   - Check if requests reach localhost:3001

3. **Verify All Services**
   - Hardhat node: http://localhost:8545
   - Backend API: http://localhost:3001
   - Frontend: http://localhost:3000

4. **Restart Everything**
   - Stop all terminals
   - **Clear database:** `npm run clear-db` (if Hardhat node was restarted)
   - Start Hardhat node: `npx hardhat node`
   - Deploy contracts: `npm run deploy:local`
   - Start backend: `cd backend && npm run dev`
   - Start frontend: `cd frontend && npm run dev`
   - Clear browser cache

