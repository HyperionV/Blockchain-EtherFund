export interface Campaign {
  id: number;
  contractAddress: string;
  creator: string;
  title: string;
  description: string | null;
  goalAmount: string;
  deadline: number;
  totalRaised?: string;
  goalReached?: boolean;
  fundsWithdrawn?: boolean;
  contributorCount?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface Contribution {
  id: number;
  campaignId: number;
  contributorAddress: string;
  amount: string;
  transactionHash: string;
  blockNumber: number | null;
  createdAt: number;
}

export interface CreateCampaignInput {
  title: string;
  description?: string;
  goalAmount: string; // in ETH
  deadline: number; // Unix timestamp
}

