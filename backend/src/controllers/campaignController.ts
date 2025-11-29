import { Request, Response, NextFunction } from "express";
import * as campaignQueries from "../db/queries/campaigns";
import * as contributionQueries from "../db/queries/contributions";
import * as withdrawalQueries from "../db/queries/withdrawals";
import { db } from "../config/database";
import { BlockchainService } from "../services/blockchainService";
import { NotFoundError, ValidationError } from "../utils/errors";
import { logger } from "../utils/logger";

const blockchainService = new BlockchainService();

/**
 * Create a new campaign (metadata only)
 */
export async function createCampaign(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, goalAmount, deadline, contractAddress, creatorAddress } = req.body;

    // Check if contract address already exists
    const existing = campaignQueries.getCampaignByContractAddress(db, contractAddress);
    if (existing) {
      return next(new ValidationError("Campaign with this contract address already exists"));
    }

    const campaignId = campaignQueries.createCampaign(db, {
      contract_address: contractAddress,
      creator_address: creatorAddress,
      title,
      description: description || null,
      goal_amount: goalAmount,
      deadline,
    });

    const campaign = campaignQueries.getCampaignById(db, campaignId);

    res.status(201).json({
      id: campaign!.id,
      contractAddress: campaign!.contract_address,
      creator: campaign!.creator_address,
      title: campaign!.title,
      description: campaign!.description,
      goalAmount: campaign!.goal_amount,
      deadline: campaign!.deadline,
      createdAt: campaign!.created_at,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all campaigns
 */
export async function getAllCampaigns(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const campaigns = campaignQueries.getAllCampaigns(db);
    
    // Enrich with blockchain data
    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const details = await blockchainService.getCampaignDetails(campaign.contract_address);
          return {
            id: campaign.id,
            contractAddress: campaign.contract_address,
            creator: campaign.creator_address,
            title: campaign.title,
            description: campaign.description,
            goalAmount: campaign.goal_amount,
            deadline: campaign.deadline,
            totalRaised: details.totalRaised.toString(),
            goalReached: details.goalReached,
            fundsWithdrawn: details.fundsWithdrawn,
            contributorCount: details.contributorCount.toString(),
            createdAt: campaign.created_at,
          };
        } catch (error: any) {
          // Contract might not exist (e.g., after Hardhat node restart)
          const errorMessage = error.message || 'Unknown error';
          const isContractMissing = errorMessage.includes('not found') || 
                                   errorMessage.includes('lost after blockchain restart') ||
                                   errorMessage.includes('could not decode');
          
          if (isContractMissing) {
            logger.warn(`Campaign ${campaign.id} contract missing (${campaign.contract_address}): ${errorMessage}`);
          } else {
            logger.error(`Failed to fetch blockchain data for campaign ${campaign.id}`, error);
          }
          
          // Return campaign with default values when contract is missing
          return {
            id: campaign.id,
            contractAddress: campaign.contract_address,
            creator: campaign.creator_address,
            title: campaign.title,
            description: campaign.description,
            goalAmount: campaign.goal_amount,
            deadline: campaign.deadline,
            totalRaised: '0',
            goalReached: false,
            fundsWithdrawn: false,
            contributorCount: '0',
            createdAt: campaign.created_at,
            contractMissing: isContractMissing, // Flag to indicate contract is missing
          };
        }
      })
    );

    res.json(enrichedCampaigns);
  } catch (error) {
    next(error);
  }
}

/**
 * Get campaign by ID
 */
export async function getCampaignById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new ValidationError("Invalid campaign ID"));
    }

    const campaign = campaignQueries.getCampaignById(db, id);
    if (!campaign) {
      return next(new NotFoundError("Campaign"));
    }

    // Fetch blockchain data
    const details = await blockchainService.getCampaignDetails(campaign.contract_address);
    const contributions = contributionQueries.getContributionsByCampaign(db, id);

    res.json({
      id: campaign.id,
      contractAddress: campaign.contract_address,
      creator: campaign.creator_address,
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goal_amount,
      deadline: campaign.deadline,
      totalRaised: details.totalRaised.toString(),
      goalReached: details.goalReached,
      fundsWithdrawn: details.fundsWithdrawn,
      contributorCount: details.contributorCount.toString(),
      contributions,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get contributions for a campaign
 */
export async function getCampaignContributions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(new ValidationError("Invalid campaign ID"));
    }

    const campaign = campaignQueries.getCampaignById(db, id);
    if (!campaign) {
      return next(new NotFoundError("Campaign"));
    }

    const contributions = contributionQueries.getContributionsByCampaign(db, id);
    res.json(contributions);
  } catch (error) {
    next(error);
  }
}

/**
 * Sync campaign state from blockchain
 */
export async function syncCampaign(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { contractAddress } = req.body;

    const campaign = campaignQueries.getCampaignByContractAddress(db, contractAddress);
    if (!campaign) {
      return next(new NotFoundError("Campaign"));
    }

    // Fetch latest state from blockchain
    const details = await blockchainService.getCampaignDetails(contractAddress);

    res.json({
      contractAddress,
      totalRaised: details.totalRaised.toString(),
      goalReached: details.goalReached,
      fundsWithdrawn: details.fundsWithdrawn,
      contributorCount: details.contributorCount.toString(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get campaigns by creator address
 */
export async function getCampaignsByCreator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return next(new ValidationError("Invalid address format"));
    }

    const campaigns = campaignQueries.getCampaignsByCreator(db, address);
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
}

/**
 * Get contributions by contributor address
 */
export async function getContributionsByContributor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return next(new ValidationError("Invalid address format"));
    }

    const contributions = contributionQueries.getContributionsByContributor(db, address);
    res.json(contributions);
  } catch (error) {
    next(error);
  }
}

