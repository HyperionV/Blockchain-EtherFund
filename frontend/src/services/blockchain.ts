import { ethers } from 'ethers';
import { Campaign as CampaignContract } from '../../../typechain-types';
import CampaignABI from '../../../artifacts/contracts/Campaign.sol/Campaign.json';
import CampaignFactoryABI from '../../../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS || '';

export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

export async function revokePermissions(): Promise<void> {
  if (!window.ethereum) {
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }],
    });
  } catch (error) {
    // Ignore errors if permissions don't exist or revoke fails
    console.log('Revoke permissions:', error);
  }
}

export async function connectWallet(forceAccountSelection: boolean = false): Promise<ethers.BrowserProvider> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  // If forcing account selection, revoke permissions first to show account picker
  if (forceAccountSelection) {
    await revokePermissions();
    // Small delay to ensure revoke completes
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Request account access - this will show MetaMask's account selection dialog
  // If permissions were revoked, it will show the account picker
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.JsonRpcSigner> {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider not available');
  }
  return await provider.getSigner();
}

export async function getCampaignContract(
  address: string
): Promise<CampaignContract> {
  const signer = await getSigner();
  return new ethers.Contract(address, CampaignABI.abi, signer) as unknown as CampaignContract;
}

export async function getCampaignContractReadOnly(
  address: string
): Promise<CampaignContract> {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider not available');
  }
  return new ethers.Contract(address, CampaignABI.abi, provider) as unknown as CampaignContract;
}

export async function getFactoryContract() {
  if (!FACTORY_ADDRESS) {
    throw new Error('Factory contract address not configured. Please set VITE_FACTORY_CONTRACT_ADDRESS in .env file');
  }
  const signer = await getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, CampaignFactoryABI.abi, signer);
}

export async function createCampaign(
  goalAmount: bigint,
  deadline: bigint
): Promise<string> {
  const factory = await getFactoryContract();
  const tx = await factory.createCampaign(goalAmount, deadline);
  const receipt = await tx.wait();
  
  const event = receipt?.logs.find(
    (log: any) => log.fragment?.name === 'CampaignCreated'
  );
  
  if (!event) {
    throw new Error('CampaignCreated event not found');
  }
  
  return event.args[1]; // campaign address
}

export async function contributeToCampaign(
  campaignAddress: string,
  amount: bigint
): Promise<ethers.ContractTransactionReceipt | null> {
  const campaign = await getCampaignContract(campaignAddress);
  const tx = await campaign.contribute({ value: amount });
  return await tx.wait();
}

export async function withdrawFromCampaign(
  campaignAddress: string
): Promise<ethers.ContractTransactionReceipt | null> {
  const campaign = await getCampaignContract(campaignAddress);
  const tx = await campaign.withdraw();
  return await tx.wait();
}

export async function getContribution(
  campaignAddress: string,
  contributorAddress: string
): Promise<bigint> {
  // Use read-only contract to avoid needing signer
  const campaign = await getCampaignContractReadOnly(campaignAddress);
  return await campaign.getContribution(contributorAddress);
}

export async function refundFromCampaign(
  campaignAddress: string
): Promise<ethers.ContractTransactionReceipt | null> {
  const campaign = await getCampaignContract(campaignAddress);
  const tx = await campaign.refund();
  return await tx.wait();
}

export function formatEther(value: bigint | string): string {
  return ethers.formatEther(value);
}

export function parseEther(value: string): bigint {
  return ethers.parseEther(value);
}

export async function getNetwork(): Promise<{ chainId: bigint; name: string }> {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider not available');
  }
  const network = await provider.getNetwork();
  return {
    chainId: network.chainId,
    name: network.name,
  };
}

