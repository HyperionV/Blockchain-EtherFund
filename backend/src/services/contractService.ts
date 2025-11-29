import { ethers } from "ethers";
import CampaignFactoryABI from "../../../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json";

export class ContractService {
  private factoryAddress: string;

  constructor(factoryAddress?: string) {
    this.factoryAddress = factoryAddress || process.env.FACTORY_CONTRACT_ADDRESS || "";
  }

  /**
   * Get factory contract ABI
   */
  getFactoryABI(): any[] {
    return CampaignFactoryABI.abi;
  }

  /**
   * Get factory contract address
   */
  getFactoryAddress(): string {
    return this.factoryAddress;
  }

  /**
   * Validate Ethereum address
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Validate contract address format
   */
  isValidContractAddress(address: string): boolean {
    return this.isValidAddress(address) && address.length === 42;
  }
}

