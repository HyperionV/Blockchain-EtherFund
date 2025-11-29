import Database from "better-sqlite3";
import { Campaign } from "../schema";

export function createCampaign(
  db: Database.Database,
  campaign: Omit<Campaign, "id" | "created_at" | "updated_at">
): number {
  const stmt = db.prepare(`
    INSERT INTO campaigns (
      contract_address,
      creator_address,
      title,
      description,
      goal_amount,
      deadline
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    campaign.contract_address,
    campaign.creator_address,
    campaign.title,
    campaign.description,
    campaign.goal_amount,
    campaign.deadline
  );

  return result.lastInsertRowid as number;
}

export function getCampaignById(
  db: Database.Database,
  id: number
): Campaign | undefined {
  const stmt = db.prepare("SELECT * FROM campaigns WHERE id = ?");
  return stmt.get(id) as Campaign | undefined;
}

export function getCampaignByContractAddress(
  db: Database.Database,
  contractAddress: string
): Campaign | undefined {
  const stmt = db.prepare("SELECT * FROM campaigns WHERE contract_address = ?");
  return stmt.get(contractAddress) as Campaign | undefined;
}

export function getAllCampaigns(db: Database.Database): Campaign[] {
  const stmt = db.prepare("SELECT * FROM campaigns ORDER BY created_at DESC");
  return stmt.all() as Campaign[];
}

export function getCampaignsByCreator(
  db: Database.Database,
  creatorAddress: string
): Campaign[] {
  const stmt = db.prepare("SELECT * FROM campaigns WHERE creator_address = ? ORDER BY created_at DESC");
  return stmt.all(creatorAddress) as Campaign[];
}

export function updateCampaign(
  db: Database.Database,
  id: number,
  updates: Partial<Pick<Campaign, "title" | "description" | "updated_at">>
): void {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  fields.push("updated_at = strftime('%s', 'now')");
  values.push(id);

  const stmt = db.prepare(`UPDATE campaigns SET ${fields.join(", ")} WHERE id = ?`);
  stmt.run(...values);
}

