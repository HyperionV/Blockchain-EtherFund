import { useParams } from 'react-router-dom';
import { useCampaign } from '../hooks/useCampaigns';
import { useWeb3 } from '../contexts/Web3Context';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ContributionForm } from './ContributionForm';
import { WithdrawButton } from './WithdrawButton';
import { RefundButton } from './RefundButton';
import { formatEther, formatDate, getTimeRemaining, isDeadlinePassed } from '../utils/ethers';

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, isLoading, error } = useCampaign(Number(id));
  const { address, isConnected } = useWeb3();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !campaign) {
    return <ErrorMessage message="Failed to load campaign" />;
  }

  const goalAmount = formatEther(campaign.goalAmount);
  const totalRaised = campaign.totalRaised ? formatEther(campaign.totalRaised) : '0';
  const progress = campaign.totalRaised && campaign.goalAmount
    ? (Number(campaign.totalRaised) / Number(campaign.goalAmount)) * 100
    : 0;
  const deadlinePassed = isDeadlinePassed(campaign.deadline);
  const isCreator = address?.toLowerCase() === campaign.creator.toLowerCase();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
      
      {campaign.description && (
        <p className="text-gray-400 mb-6">{campaign.description}</p>
      )}

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Goal</p>
            <p className="text-2xl font-bold">{goalAmount} ETH</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Raised</p>
            <p className="text-2xl font-bold">{totalRaised} ETH</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Deadline</p>
            <p className="text-lg">{formatDate(campaign.deadline)}</p>
            <p className="text-sm text-gray-500">{getTimeRemaining(campaign.deadline)}</p>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {campaign.contributorCount || 0} contributors
          </span>
          {campaign.goalReached && (
            <span className="text-green-400 font-semibold">Goal Reached!</span>
          )}
        </div>
      </div>

      {isConnected && !deadlinePassed && !campaign.goalReached && (
        <ContributionForm campaignAddress={campaign.contractAddress} />
      )}

      {isConnected && isCreator && campaign.goalReached && !campaign.fundsWithdrawn && (
        <WithdrawButton campaignAddress={campaign.contractAddress} />
      )}

      {isConnected && !isCreator && deadlinePassed && !campaign.goalReached && (
        <RefundButton campaignAddress={campaign.contractAddress} />
      )}
    </div>
  );
}

