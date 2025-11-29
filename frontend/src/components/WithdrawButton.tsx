import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { withdrawFromCampaign } from '../services/blockchain';
import { ErrorMessage } from './ErrorMessage';

interface WithdrawButtonProps {
  campaignAddress: string;
}

export function WithdrawButton({ campaignAddress }: WithdrawButtonProps) {
  const queryClient = useQueryClient();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    setError(null);

    try {
      setIsWithdrawing(true);
      await withdrawFromCampaign(campaignAddress);

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw funds');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      <button
        onClick={handleWithdraw}
        disabled={isWithdrawing}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        aria-label="Withdraw campaign funds"
      >
        {isWithdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
      </button>
    </div>
  );
}

