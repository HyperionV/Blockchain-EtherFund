import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { refundFromCampaign } from '../services/blockchain';
import { useContribution } from '../hooks/useContribution';
import { formatEther } from '../utils/ethers';
import { ErrorMessage } from './ErrorMessage';

interface RefundButtonProps {
  campaignAddress: string;
}

export function RefundButton({ campaignAddress }: RefundButtonProps) {
  const queryClient = useQueryClient();
  const { data: contribution, isLoading: isLoadingContribution, refetch } = useContribution(campaignAddress);
  const [isRefunding, setIsRefunding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefund = async () => {
    setError(null);

    // Check if user has contribution to refund
    if (!contribution || contribution === BigInt(0)) {
      setError('No contribution to refund or refund already claimed');
      // Refetch to ensure we have latest data
      await refetch();
      return;
    }

    try {
      setIsRefunding(true);
      await refundFromCampaign(campaignAddress);

      // Refetch contribution balance to update UI
      await refetch();

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['contribution'] });
    } catch (err: any) {
      // Check if error is about no contribution
      if (err.message?.includes('No contribution to refund')) {
        setError('You have already claimed your refund');
        // Refetch to update UI
        await refetch();
      } else {
        setError(err.message || 'Failed to claim refund');
      }
    } finally {
      setIsRefunding(false);
    }
  };

  // Show loading state
  if (isLoadingContribution) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400 text-center">Checking contribution...</p>
      </div>
    );
  }

  // Don't show button if no contribution or already refunded
  if (!contribution || contribution === BigInt(0)) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400 text-center">
          No contribution to refund or refund already claimed
        </p>
      </div>
    );
  }

  const contributionAmount = formatEther(contribution);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Your Contribution</p>
        <p className="text-xl font-bold">{contributionAmount} ETH</p>
      </div>
      
      <button
        onClick={handleRefund}
        disabled={isRefunding || contribution === BigInt(0)}
        className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        aria-label="Claim refund for contribution"
      >
        {isRefunding ? 'Processing...' : 'Claim Refund'}
      </button>
    </div>
  );
}

