import Database from "better-sqlite3";
import path from "path";
import { initDatabase } from "../db/migrations";
import { checkAndCleanupDatabase } from "../utils/dbCleanup";
import { logger } from "../utils/logger";

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "../../database.db");

export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
initDatabase(db);

// Check if Hardhat node was reset and warn user
// Run asynchronously to not block database initialization
setImmediate(async () => {
  try {
    const factoryAddress = process.env.FACTORY_CONTRACT_ADDRESS;
    if (factoryAddress) {
      const { ethers } = await import("ethers");
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      
      try {
        const code = await provider.getCode(factoryAddress);
        const contractExists = code !== '0x' && code !== null && code.length > 2;
        
        if (!contractExists) {
          logger.warn("⚠️  WARNING: Factory contract not found on blockchain!");
          logger.warn("⚠️  This usually means the Hardhat node was restarted.");
          logger.warn("⚠️  ACTION REQUIRED: Run 'npm run clear-db' before deploying new contracts.");
          logger.warn("⚠️  Old campaign data in database is now invalid and should be cleared.");
        }
      } catch (error: any) {
        // Hardhat node might not be running - that's OK, just skip the check
        if (!error.message?.includes("ECONNREFUSED")) {
          logger.warn(`Could not check factory contract: ${error.message}`);
        }
      }
    }
  } catch (error: any) {
    // Ignore errors - don't block startup
  }
});

export default db;

