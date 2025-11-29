import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Campaign } from '../types';

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => api.get<Campaign[]>('/api/campaigns'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useCampaign(id: number) {
  return useQuery<Campaign>({
    queryKey: ['campaign', id],
    queryFn: () => api.get<Campaign>(`/api/campaigns/${id}`),
    enabled: !!id,
    refetchInterval: 30000,
  });
}

