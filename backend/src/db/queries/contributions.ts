import Database from "better-sqlite3";
import { Contribution } from "../schema";

export function createContribution(
  db: Database.Database,
  contribution: Omit<Contribution, "id" | "created_at">
): number {
  const stmt = db.prepare(`
    INSERT INTO contributions (
      campaign_id,
      contributor_address,
      amount,
      transaction_hash,
      block_number
    ) VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    contribution.campaign_id,
    contribution.contributor_address,
    contribution.amount,
    contribution.transaction_hash,
    contribution.block_number
  );

  return result.lastInsertRowid as number;
}

export function getContributionsByCampaign(
  db: Database.Database,
  campaignId: number
): Contribution[] {
  const stmt = db.prepare("SELECT * FROM contributions WHERE campaign_id = ? ORDER BY created_at DESC");
  return stmt.all(campaignId) as Contribution[];
}

export function getContributionsByContributor(
  db: Database.Database,
  contributorAddress: string
): Contribution[] {
  const stmt = db.prepare("SELECT * FROM contributions WHERE contributor_address = ? ORDER BY created_at DESC");
  return stmt.all(contributorAddress) as Contribution[];
}

export function getContributionByTxHash(
  db: Database.Database,
  txHash: string
): Contribution | undefined {
  const stmt = db.prepare("SELECT * FROM contributions WHERE transaction_hash = ?");
  return stmt.get(txHash) as Contribution | undefined;
}

