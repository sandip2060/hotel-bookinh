import express from "express";
import { clerkWebhookHandler } from "../controllers/clerkWebhooks.js";

const webhookRouter = express.Router();

webhookRouter.post('/', clerkWebhookHandler);

export default webhookRouter;