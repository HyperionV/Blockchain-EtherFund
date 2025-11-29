/**
 * Database schema definitions
 */

export interface Campaign {
  id: number;
  contract_address: string;
  creator_address: string;
  title: string;
  description: string | null;
  goal_amount: string; // Stored as string to preserve precision
  deadline: number; // Unix timestamp
  created_at: number;
  updated_at: number;
}

export interface Contribution {
  id: number;
  campaign_id: number;
  contributor_address: string;
  amount: string; // Stored as string to preserve precision
  transaction_hash: string;
  block_number: number | null;
  created_at: number;
}

export interface Withdrawal {
  id: number;
  campaign_id: number;
  amount: string; // Stored as string to preserve precision
  transaction_hash: string;
  created_at: number;
}

