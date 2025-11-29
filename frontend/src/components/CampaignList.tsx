import { useCampaigns } from '../hooks/useCampaigns';
import { CampaignCard } from './CampaignCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function CampaignList() {
  const { data: campaigns, isLoading, error } = useCampaigns();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load campaigns" />;
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No campaigns found</p>
        <p className="text-gray-500 mt-2">Be the first to create a campaign!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

