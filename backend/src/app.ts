import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import campaignsRouter from "./routes/campaigns";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import "./config/database"; // Initialize database and check for reset

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/campaigns", campaignsRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;

