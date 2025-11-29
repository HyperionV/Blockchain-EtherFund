import { ethers } from "ethers";
import Database from "better-sqlite3";
import { logger } from "./logger";

/**
 * Check if a contract exists at the given address
 */
async function isContractExists(address: string, provider: ethers.Provider): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== '0x' && code !== null && code.length > 2;
  } catch (error) {
    return false;
  }
}

/**
 * Check if Hardhat node has been reset by verifying factory contract exists
 */
export async function isHardhatNodeReset(factoryAddress: string | undefined): Promise<boolean> {
  if (!factoryAddress) {
    // No factory address configured, can't check
    return false;
  }

  try {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const exists = await isContractExists(factoryAddress, provider);
    return !exists; // If contract doesn't exist, node was reset
  } catch (error: any) {
    // If we can't connect to the node, assume it's not reset (node might not be running)
    logger.warn(`Could not check factory contract: ${error.message}`);
    return false;
  }
}

/**
 * Clear all campaign-related data from database
 */
export function clearDatabase(db: Database.Database): void {
  logger.info("Clearing database...");
  
  try {
    // Delete in order to respect foreign key constraints
    db.exec(`
      DELETE FROM withdrawals;
      DELETE FROM contributions;
      DELETE FROM campaigns;
    `);
    
    // Reset auto-increment counters
    db.exec(`
      DELETE FROM sqlite_sequence WHERE name IN ('campaigns', 'contributions', 'withdrawals');
    `);
    
    logger.info("Database cleared successfully");
  } catch (error: any) {
    logger.error(`Failed to clear database: ${error.message}`);
    throw error;
  }
}

/**
 * Check if node was reset and clear database if needed
 */
export async function checkAndCleanupDatabase(
  db: Database.Database,
  factoryAddress: string | undefined
): Promise<boolean> {
  const wasReset = await isHardhatNodeReset(factoryAddress);
  
  if (wasReset) {
    logger.warn("Hardhat node appears to have been reset. Clearing database...");
    clearDatabase(db);
    return true;
  }
  
  return false;
}

