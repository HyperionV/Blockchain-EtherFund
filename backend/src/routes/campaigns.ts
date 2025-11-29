import { Router } from "express";
import * as campaignController from "../controllers/campaignController";
import { validate, createCampaignSchema, syncCampaignSchema } from "../middleware/validation";

const router = Router();

router.get("/", campaignController.getAllCampaigns);
router.get("/:id", campaignController.getCampaignById);
router.post("/", validate(createCampaignSchema), campaignController.createCampaign);
router.get("/:id/contributions", campaignController.getCampaignContributions);
router.post("/:id/sync", validate(syncCampaignSchema), campaignController.syncCampaign);
router.get("/users/:address/campaigns", campaignController.getCampaignsByCreator);
router.get("/users/:address/contributions", campaignController.getContributionsByContributor);

export default router;

