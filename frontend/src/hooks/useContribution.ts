import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from '../contexts/Web3Context';
import { getContribution } from '../services/blockchain';

export function useContribution(campaignAddress: string | undefined) {
  const { address, isConnected } = useWeb3();

  return useQuery<bigint>({
    queryKey: ['contribution', campaignAddress, address],
    queryFn: async () => {
      if (!campaignAddress || !address) {
        return BigInt(0);
      }
      return await getContribution(campaignAddress, address);
    },
    enabled: !!campaignAddress && !!address && isConnected,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

