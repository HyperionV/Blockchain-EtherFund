import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
        return next(new ValidationError(messages.join(", ")));
      }
      next(error);
    }
  };
}

export const createCampaignSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  goalAmount: z.string().regex(/^\d+$/, "Goal amount must be a valid number in Wei"),
  deadline: z.number().int().positive(),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address"),
  creatorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid creator address"),
});

export const syncCampaignSchema = z.object({
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address"),
});

