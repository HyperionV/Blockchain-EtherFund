# Blockchain Integration Guide

## Overview

EtherFund integrates with Ethereum blockchain through smart contracts and MetaMask wallet. This guide explains how the integration works.

## Architecture

### Smart Contract Layer

**CampaignFactory.sol**
- Deployed once to create campaign instances
- Factory pattern for efficient deployment
- Tracks all created campaigns

**Campaign.sol**
- Individual campaign contract
- Manages funds, contributions, withdrawals
- Enforces campaign rules on-chain

### Frontend Integration

**Web3Provider**
- Manages MetaMask connection
- Provides wallet address and signer
- Handles network switching

**Blockchain Service**
- Wraps Ethers.js for contract interactions
- Handles transaction signing
- Manages contract instances

### Backend Integration

**Blockchain Service**
- Reads contract state
- Syncs database with blockchain
- Validates contract addresses

## MetaMask Setup

### Installation

1. Install MetaMask browser extension
2. Create or import wallet
3. Add local network (for development):
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

### Connecting to Application

1. Click "Connect Wallet" button
2. Approve connection in MetaMask
3. Select account to use
4. Approve network if prompted

## Transaction Flow

### Creating a Campaign

1. User fills form in frontend
2. Frontend calls `factory.createCampaign()`
3. MetaMask prompts for transaction approval
4. Transaction sent to blockchain
5. Contract emits `CampaignCreated` event
6. Frontend extracts campaign address from event
7. Frontend sends metadata to backend API

### Contributing

1. User enters contribution amount
2. Frontend calls `campaign.contribute({ value: amount })`
3. MetaMask prompts for transaction approval
4. Transaction sent to blockchain
5. Contract updates state and emits event
6. Frontend refreshes campaign data

### Withdrawing

1. Creator clicks withdraw button
2. Frontend calls `campaign.withdraw()`
3. MetaMask prompts for transaction approval
4. Contract validates and transfers funds
5. Frontend updates UI

### Refunding

1. Contributor clicks refund button
2. Frontend calls `campaign.refund()`
3. MetaMask prompts for transaction approval
4. Contract validates and transfers funds back
5. Frontend updates UI

## Event Listening

Smart contracts emit events for important state changes:

- `CampaignCreated` - New campaign deployed
- `ContributionMade` - New contribution received
- `WithdrawalMade` - Funds withdrawn
- `RefundClaimed` - Refund processed
- `GoalReached` - Campaign goal achieved

These events can be indexed by backend services for database synchronization.

## Error Handling

### Common Errors

**User Rejected Transaction**
- User cancels MetaMask prompt
- Show user-friendly message
- Don't retry automatically

**Insufficient Funds**
- User doesn't have enough ETH
- Show error with required amount
- Suggest adding funds

**Network Mismatch**
- User on wrong network
- Prompt to switch networks
- Provide network details

**Contract Not Found**
- Invalid contract address
- Verify address is correct
- Check network matches

## Best Practices

1. **Always validate** contract addresses before interactions
2. **Show loading states** during transactions
3. **Handle errors gracefully** with user-friendly messages
4. **Refresh data** after successful transactions
5. **Cache contract instances** to reduce RPC calls
6. **Use events** for off-chain indexing when possible

## Testing

### Local Testing

1. Start Hardhat node: `npx hardhat node`
2. Import test accounts into MetaMask
3. Connect to local network
4. Test all transaction flows

### Testnet Testing

1. Deploy to Sepolia testnet
2. Get testnet ETH from faucet
3. Connect MetaMask to Sepolia
4. Test with real network conditions

## Security Considerations

- Never expose private keys
- Validate all user inputs
- Use checks-effects-interactions pattern
- Implement reentrancy guards
- Test edge cases thoroughly
- Audit smart contracts before mainnet

