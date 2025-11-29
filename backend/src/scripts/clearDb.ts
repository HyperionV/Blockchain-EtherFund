#!/usr/bin/env node

/**
 * Script to manually clear the database
 * Usage: npm run clear-db
 */

import Database from "better-sqlite3";
import path from "path";
import { clearDatabase } from "../utils/dbCleanup";
import { logger } from "../utils/logger";

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "../../database.db");

try {
  logger.info("Connecting to database...");
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");
  
  logger.info("Clearing database...");
  clearDatabase(db);
  
  db.close();
  logger.info("Database cleared successfully!");
  process.exit(0);
} catch (error: any) {
  logger.error(`Failed to clear database: ${error.message}`);
  process.exit(1);
}

