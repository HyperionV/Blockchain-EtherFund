import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  goalAmount: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount').refine(
    (val) => parseFloat(val) > 0,
    'Goal amount must be greater than 0'
  ),
  deadline: z.string().refine(
    (val) => {
      const date = new Date(val);
      return date.getTime() > Date.now();
    },
    'Deadline must be in the future'
  ),
});

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

