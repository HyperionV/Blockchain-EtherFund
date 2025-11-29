# Smart Contracts Documentation

## Contracts

### Campaign.sol

Individual crowdfunding campaign contract.

#### State Variables

- `goalAmount` (uint256): Funding goal in Wei
- `deadline` (uint256): Campaign deadline as Unix timestamp
- `totalRaised` (uint256): Total amount raised
- `goalReached` (bool): Whether goal has been reached
- `fundsWithdrawn` (bool): Whether funds have been withdrawn
- `contributions` (mapping): Contribution amount per address
- `contributors` (address[]): List of contributor addresses

#### Functions

**contribute()**
- Allows users to contribute ETH to the campaign
- Updates contribution tracking
- Emits `ContributionMade` event
- Reverts if campaign ended or goal reached

**withdraw()**
- Allows creator to withdraw funds
- Only callable by owner (creator)
- Requires goal reached and funds not already withdrawn
- Emits `WithdrawalMade` event

**refund()**
- Allows contributors to claim refunds
- Only available after deadline if goal not reached
- Emits `RefundClaimed` event

**getCampaignDetails()**
- Returns all campaign information
- View function (no gas cost)

**getContribution(address)**
- Returns contribution amount for an address
- View function

**isActive()**
- Returns whether campaign is still active
- View function

#### Events

- `ContributionMade(address indexed contributor, uint256 amount)`
- `WithdrawalMade(address indexed creator, uint256 amount)`
- `RefundClaimed(address indexed contributor, uint256 amount)`
- `GoalReached(uint256 totalRaised)`

### CampaignFactory.sol

Factory contract for deploying Campaign instances.

#### Functions

**createCampaign(uint256 goalAmount, uint256 deadline)**
- Deploys a new Campaign contract
- Returns the campaign address
- Emits `CampaignCreated` event

**getCampaignCount()**
- Returns total number of campaigns
- View function

**getCampaign(uint256 index)**
- Returns campaign address at index
- View function

**getCreatorCampaigns(address creator)**
- Returns all campaigns created by an address
- View function

#### Events

- `CampaignCreated(address indexed creator, address indexed campaignAddress, uint256 goalAmount, uint256 deadline)`

## Security Features

1. **ReentrancyGuard**: Prevents reentrancy attacks on state-changing functions
2. **Ownable**: Access control for withdrawal function
3. **Input Validation**: Validates goal amount and deadline on construction
4. **Deadline Checks**: Prevents operations after deadline
5. **Goal Checks**: Prevents contributions after goal reached

## Gas Optimization

- Uses mappings for efficient lookups
- Minimal storage operations
- Events for off-chain indexing
- View functions for read operations

## Deployment

Deploy the factory contract first, then use it to create campaigns:

```typescript
const factory = await CampaignFactory.deploy();
const tx = await factory.createCampaign(goalAmount, deadline);
```

