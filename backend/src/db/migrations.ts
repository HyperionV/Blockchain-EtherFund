import Database from "better-sqlite3";

export function initDatabase(db: Database.Database): void {
  // Create campaigns table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contract_address TEXT UNIQUE NOT NULL,
      creator_address TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      goal_amount TEXT NOT NULL,
      deadline INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  // Create contributions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      contributor_address TEXT NOT NULL,
      amount TEXT NOT NULL,
      transaction_hash TEXT UNIQUE NOT NULL,
      block_number INTEGER,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );
  `);

  // Create withdrawals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      amount TEXT NOT NULL,
      transaction_hash TEXT UNIQUE NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_campaigns_contract_address ON campaigns(contract_address);
    CREATE INDEX IF NOT EXISTS idx_campaigns_creator_address ON campaigns(creator_address);
    CREATE INDEX IF NOT EXISTS idx_contributions_campaign_id ON contributions(campaign_id);
    CREATE INDEX IF NOT EXISTS idx_contributions_contributor_address ON contributions(contributor_address);
    CREATE INDEX IF NOT EXISTS idx_withdrawals_campaign_id ON withdrawals(campaign_id);
  `);
}
