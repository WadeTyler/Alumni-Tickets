import express from 'express';
import protectedRoute from "../middlewares/protectedRoute.js";
import {improveDescription} from "../controllers/ai.controller.js";
const router = express.Router();

router.post("/improve/description", protectedRoute, improveDescription);

export default router;