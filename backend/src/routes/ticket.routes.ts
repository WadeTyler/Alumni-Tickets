import express from 'express';
import {getTicketByCode, getTicketsByCodes, purchaseTicket, useTicket} from "../controllers/ticket.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js";
const router = express.Router();

router.post("/purchase", purchaseTicket);
router.put("/:code/use", protectedRoute, useTicket);
router.get("/:code", getTicketByCode);
router.get("/", getTicketsByCodes);

export default router;