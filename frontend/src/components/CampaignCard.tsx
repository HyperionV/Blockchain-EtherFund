import { Link } from 'react-router-dom';
import { Campaign } from '../types';
import { formatEther, formatDate, getTimeRemaining, isDeadlinePassed } from '../utils/ethers';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const goalAmount = formatEther(campaign.goalAmount);
  const totalRaised = campaign.totalRaised ? formatEther(campaign.totalRaised) : '0';
  const progress = campaign.totalRaised && campaign.goalAmount
    ? (Number(campaign.totalRaised) / Number(campaign.goalAmount)) * 100
    : 0;
  const deadlinePassed = isDeadlinePassed(campaign.deadline);
  const timeRemaining = getTimeRemaining(campaign.deadline);

  return (
    <Link
      to={`/campaign/${campaign.id}`}
      className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
      aria-label={`View campaign: ${campaign.title}`}
    >
      <h3 className="text-xl font-bold mb-2">{campaign.title}</h3>
      {campaign.description && (
        <p className="text-gray-400 mb-4 line-clamp-2">{campaign.description}</p>
      )}
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Raised</span>
          <span className="font-semibold">
            {totalRaised} / {goalAmount} ETH
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className={`${deadlinePassed ? 'text-red-400' : 'text-gray-400'}`}>
          {deadlinePassed ? 'Ended' : timeRemaining}
        </span>
        {campaign.goalReached && (
          <span className="text-green-400 font-semibold">Goal Reached!</span>
        )}
      </div>
    </Link>
  );
}

