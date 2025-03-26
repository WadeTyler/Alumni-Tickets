import express from 'express';
import {createEvent, deleteEvent, getAllEvents, getEvent} from "../controllers/event.controller.ts";
import protectedRoute from "../middlewares/protectedRoute.ts";
const router = express.Router();

router.get("/", getAllEvents);
router.get("/:event_id", getEvent);
router.post("/", protectedRoute, createEvent);
router.delete("/:event_id", protectedRoute, deleteEvent);

export default router;