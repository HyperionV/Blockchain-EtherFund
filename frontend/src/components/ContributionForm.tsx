import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { contributeToCampaign } from '../services/blockchain';
import { parseEther } from '../utils/ethers';
import { ErrorMessage } from './ErrorMessage';

interface ContributionFormProps {
  campaignAddress: string;
}

export function ContributionForm({ campaignAddress }: ContributionFormProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (amountNum < 0.001) {
      setError('Minimum contribution is 0.001 ETH');
      return;
    }

    try {
      const amountWei = parseEther(amount);
      setIsSubmitting(true);

      await contributeToCampaign(campaignAddress, amountWei);

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign'] });

      setAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to contribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Contribute</h2>
      
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount (ETH)
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty, numbers, and decimals
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setAmount(value);
                // Clear error when user starts typing
                if (error && value) {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0.001) {
                    setError(null);
                  }
                }
              }
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value);
              if (e.target.value && (isNaN(value) || value <= 0)) {
                setError('Amount must be greater than 0');
              } else if (e.target.value && value < 0.001) {
                setError('Minimum contribution is 0.001 ETH');
              }
            }}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="0.0"
            required
          />
          <p className="mt-1 text-xs text-gray-400">Minimum: 0.001 ETH</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !amount}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          aria-label={`Contribute ${amount} ETH to campaign`}
        >
          {isSubmitting ? 'Processing...' : 'Contribute'}
        </button>
      </form>
    </div>
  );
}

