import type {CreateEventRequest, EventType} from "../../../types/event.types.ts";
import type {User} from "../../../types/auth.types.ts";
import {
  attemptCreateEvent,
  attemptDeleteEvent,
  findEventById,
  getAllEventsOrderByDateTimeAsc
} from "../utils/event.util.ts";


export const createEvent = async (req: any, res: any) => {
  const createEventRequest: CreateEventRequest = req.body;
  const user: User = req.body.user;

  try {
    const event: Event = await attemptCreateEvent(createEventRequest, user);

    return res.status(201).json({message: "Event created successfully.", event});
  } catch (e) {
    return res.status(400).json({message: e.message});
  }
}

export const getAllEvents = async (req: any, res: any) => {
  const events: EventType[] = await getAllEventsOrderByDateTimeAsc();

  return res.status(200).json({message: "All events retrieved.", events});
}

export const getEvent = async (req: any, res: any) => {
  const event_id: number = req.params.event_id;

  if (!event_id)
    return res.status(400).json({message: "event_id is required."});

  if (isNaN(event_id)) {
    return res.status(400).json({ message: "Event id must be a number."});
  }

  const event: EventType = await findEventById(event_id);
  if (!event)
    return res.status(404).json({message: "Event not found"});

  return res.status(200).json({message: "Event retrieved successfully.", event});
}

export const deleteEvent = async (req: any, res: any) => {
  const user: User = req.body.user;
  const event_id: number = req.params.event_id;

  // Validate event id
  if (!event_id || isNaN(event_id)) {
    return res.status(400).json({message: "Event Id is required and must be a number."});
  }

  try {
    await attemptDeleteEvent(event_id, user.id);
    return res.status(200).json({message: "Event deleted successfully."});
  } catch (e) {
    return res.status(400).json({message: e.message});
  }
}