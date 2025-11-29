import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { createCampaign as createCampaignContract } from '../services/blockchain';
import { api } from '../services/api';
import { parseEther } from '../utils/ethers';
import { createCampaignSchema, CreateCampaignFormData } from '../utils/validation';
import { ErrorMessage } from './ErrorMessage';

export function CreateCampaign() {
  const navigate = useNavigate();
  const { address, isConnected, connect } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCampaignFormData>({
    title: '',
    description: '',
    goalAmount: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConnected) {
      await connect();
      return;
    }

    try {
      // Validate form data
      const validated = createCampaignSchema.parse(formData);
      
      setIsSubmitting(true);

      // Convert deadline to Unix timestamp
      const deadline = Math.floor(new Date(validated.deadline).getTime() / 1000);
      const goalAmountWei = parseEther(validated.goalAmount);

      // Deploy contract
      const contractAddress = await createCampaignContract(goalAmountWei, BigInt(deadline));

      // Save campaign metadata to backend
      await api.post('/api/campaigns', {
        title: validated.title,
        description: validated.description,
        goalAmount: goalAmountWei.toString(),
        deadline,
        contractAddress,
        creatorAddress: address,
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="goalAmount" className="block text-sm font-medium mb-2">
            Goal Amount (ETH) *
          </label>
          <input
            id="goalAmount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.goalAmount}
            onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium mb-2">
            Deadline *
          </label>
          <input
            id="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          aria-label="Create new campaign"
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
}

