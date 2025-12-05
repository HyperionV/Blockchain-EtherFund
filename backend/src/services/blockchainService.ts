import { ethers } from "ethers";
import { Campaign as CampaignContract } from "src/../../typechain-types";
import CampaignABI from "../../../artifacts/contracts/Campaign.sol/Campaign.json";

export interface CampaignDetails {
  creator: string;
  goalAmount: bigint;
  deadline: bigint;
  totalRaised: bigint;
  goalReached: boolean;
  fundsWithdrawn: boolean;
  contributorCount: bigint;
}

export class BlockchainService {
  private provider: ethers.Provider;
  private factoryAddress: string;

  constructor(rpcUrl?: string, factoryAddress?: string) {
    this.provider = rpcUrl
      ? new ethers.JsonRpcProvider(rpcUrl)
      : new ethers.JsonRpcProvider("http://localhost:8545");
    
    this.factoryAddress = factoryAddress || process.env.FACTORY_CONTRACT_ADDRESS || "";
  }

  /**
   * Get campaign contract instance
   */
  getCampaignContract(address: string): CampaignContract {
    return new ethers.Contract(address, CampaignABI.abi, this.provider) as unknown as CampaignContract;
  }

  /**
   * Check if address is a contract
   */
  async isContract(address: string): Promise<boolean> {
    try {
      const code = await this.provider.getCode(address);
      return code !== '0x' && code !== null && code.length > 2;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get campaign details from blockchain
   */
  async getCampaignDetails(contractAddress: string): Promise<CampaignDetails> {
    // Check if contract exists (important for local development where contracts are lost on restart)
    const contractExists = await this.isContract(contractAddress);
    if (!contractExists) {
      throw new Error(`Contract not found at address ${contractAddress}. This may happen if the local blockchain was restarted.`);
    }

    try {
      const contract = this.getCampaignContract(contractAddress);
      const details = await contract.getCampaignDetails();
      
      return {
        creator: details.creator,
        goalAmount: details._goalAmount,
        deadline: details._deadline,
        totalRaised: details._totalRaised,
        goalReached: details._goalReached,
        fundsWithdrawn: details._fundsWithdrawn,
        contributorCount: details.contributorCount,
      };
    } catch (error: any) {
      // If decode error, contract might not be a Campaign contract or is corrupted
      if (error.code === 'BAD_DATA' || error.shortMessage?.includes('could not decode')) {
        throw new Error(`Invalid or corrupted contract at address ${contractAddress}. The contract may have been lost after blockchain restart.`);
      }
      throw error;
    }
  }

  /**
   * Get contribution amount for a specific address
   */
  async getContribution(contractAddress: string, contributorAddress: string): Promise<bigint> {
    const contract = this.getCampaignContract(contractAddress);
    return await contract.getContribution(contributorAddress);
  }

  /**
   * Check if campaign is active
   */
  async isCampaignActive(contractAddress: string): Promise<boolean> {
    const contract = this.getCampaignContract(contractAddress);
    return await contract.isActive();
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash);
  }
}

