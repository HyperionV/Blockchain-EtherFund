# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Initial Setup

1. Clone the repository
2. Install root dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Compile smart contracts:
```bash
npm run compile
```

## Development Workflow

### Running Locally

1. **Start local blockchain:**
```bash
npx hardhat node
```

2. **Deploy contracts:**
```bash
npm run deploy:local
```

3. **Start backend** (in new terminal):
```bash
cd backend
npm run dev
```

4. **Start frontend** (in new terminal):
```bash
cd frontend
npm run dev
```

### Testing

**Smart Contracts:**
```bash
npm test
```

**Backend:**
```bash
cd backend
npm test
```

## Code Structure

### Smart Contracts
- `contracts/` - Solidity source files
- `test/` - Hardhat test files
- `scripts/` - Deployment scripts

### Backend
- `src/config/` - Configuration files
- `src/db/` - Database schema and queries
- `src/routes/` - Express routes
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/middleware/` - Express middleware
- `src/utils/` - Utility functions

### Frontend
- `src/components/` - React components
- `src/contexts/` - React contexts
- `src/hooks/` - Custom React hooks
- `src/services/` - API and blockchain services
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions

## Best Practices

### Smart Contracts
- Always test contracts thoroughly
- Use OpenZeppelin contracts for security
- Document all functions
- Follow Solidity style guide

### Backend
- Use TypeScript for type safety
- Validate all inputs with Zod
- Handle errors gracefully
- Log important events

### Frontend
- Use TypeScript for type safety
- Keep components small and focused
- Use React Query for data fetching
- Handle loading and error states
- Ensure accessibility

## Environment Variables

### Root `.env`
```
SEPOLIA_RPC_URL=
PRIVATE_KEY=
```

### Backend `.env`
```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database.db
FACTORY_CONTRACT_ADDRESS=
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:3001
VITE_FACTORY_CONTRACT_ADDRESS=
```

## Git Workflow

1. Create feature branch
2. Make changes
3. Write/update tests
4. Commit with descriptive messages
5. Push and create pull request

## Troubleshooting

### Contracts won't compile
- Check Solidity version in `hardhat.config.ts`
- Ensure OpenZeppelin contracts are installed

### Backend won't start
- Check database path is writable
- Verify port 3001 is available
- Check environment variables

### Frontend won't connect
- Verify backend is running
- Check API URL in environment variables
- Check browser console for errors

### MetaMask connection issues
- Ensure MetaMask is installed
- Check network matches (localhost:8545)
- Reset MetaMask account if needed

