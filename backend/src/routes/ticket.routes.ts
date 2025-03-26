import express from 'express';
import {getTicketByCode, purchaseTicket, useTicket} from "../controllers/ticket.controller.ts";
import protectedRoute from "../middlewares/protectedRoute.ts";
const router = express.Router();

router.post("/purchase", purchaseTicket);
router.put("/:code/use", protectedRoute, useTicket);
router.get("/:code", getTicketByCode);

export default router;