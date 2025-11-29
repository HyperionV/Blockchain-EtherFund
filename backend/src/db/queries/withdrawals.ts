import Database from "better-sqlite3";
import { Withdrawal } from "../schema";

export function createWithdrawal(
  db: Database.Database,
  withdrawal: Omit<Withdrawal, "id" | "created_at">
): number {
  const stmt = db.prepare(`
    INSERT INTO withdrawals (
      campaign_id,
      amount,
      transaction_hash
    ) VALUES (?, ?, ?)
  `);

  const result = stmt.run(
    withdrawal.campaign_id,
    withdrawal.amount,
    withdrawal.transaction_hash
  );

  return result.lastInsertRowid as number;
}

export function getWithdrawalsByCampaign(
  db: Database.Database,
  campaignId: number
): Withdrawal[] {
  const stmt = db.prepare("SELECT * FROM withdrawals WHERE campaign_id = ? ORDER BY created_at DESC");
  return stmt.all(campaignId) as Withdrawal[];
}

export function getWithdrawalByTxHash(
  db: Database.Database,
  txHash: string
): Withdrawal | undefined {
  const stmt = db.prepare("SELECT * FROM withdrawals WHERE transaction_hash = ?");
  return stmt.get(txHash) as Withdrawal | undefined;
}

