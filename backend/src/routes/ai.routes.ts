import express from 'express';
import protectedRoute from "../middlewares/protectedRoute.ts";
import {improveDescription} from "../controllers/ai.controller.ts";
const router = express.Router();

router.post("/improve/description", protectedRoute, improveDescription);

export default router;