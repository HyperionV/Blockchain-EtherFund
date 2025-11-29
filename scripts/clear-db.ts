#!/usr/bin/env node

/**
 * Script to clear the database
 * Can be run from root directory
 * Usage: npm run clear-db
 *
 * This clears all campaigns, contributions, and withdrawals from the database.
 * Useful when restarting Hardhat node since all contracts are lost.
 */

import { execSync } from "child_process";
import path from "path";

const backendPath = path.join(__dirname, "../backend");

try {
  console.log("🗑️  Clearing database...");
  execSync("npm run clear-db", {
    cwd: backendPath,
    stdio: "inherit",
  });
  console.log("✅ Database cleared successfully!");
} catch (error: any) {
  console.error(`❌ Failed to clear database: ${error.message}`);
  process.exit(1);
}
