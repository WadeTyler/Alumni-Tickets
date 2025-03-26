import type {CreateEventRequest, EventType} from "../../../types/event.types.ts";
import type {User} from "../../../types/auth.types.ts";
import db from "../config/db.config.ts";

// VARS
const MAX_USER_EVENTS = 5;

async function countEventsByUserId(userId: string) {
  const result = await db.query("SELECT * FROM events WHERE creator_id = $1", [userId]);
  return result.rows.length;
}

export async function getAllEventsOrderByDateTimeAsc() {
  const result = await db.query("SELECT * FROM events ORDER BY date, time");
  return result.rows;
}

export async function findEventById(event_id: number): Promise<EventType> {
  const result = await db.query("SELECT * FROM events WHERE id = $1", [event_id]);
  return result.rows[0];
}

export async function attemptCreateEvent(createRequest: CreateEventRequest, user: User) {
  // Check how many events the user currently has
  if (await countEventsByUserId(user.id) === MAX_USER_EVENTS) {
    throw new Error("You have reached the max amount of events you can have active.");
  }

  validateCreateEventFields(createRequest);

  const result = await db.query("INSERT INTO events(creator_id, name, image, description, Date, time, total_tickets, tickets_remaining, ticket_price) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [
    user.id,
    createRequest.name,
    createRequest.image,
    createRequest.description,
    new Date(createRequest.date).toISOString().split("T")[0], // CONVERT TO ISO DATE
    createRequest.time,
    createRequest.total_tickets,
    createRequest.tickets_remaining,
    createRequest.ticket_price
  ]);

  return result.rows[0];
}

export async function attemptDeleteEvent(event_id: number, user_id: string) {
  const event: EventType = await findEventById(event_id);
  if (!event) {
    throw new Error("Event not found.");
  }

  // Check if owner of event
  if (event.creator_id !== user_id) {
    throw new Error("You are unauthorized to delete this event.");
  }

  // TODO: Implement refund system in prod

  // Delete the event
  await db.query("DELETE FROM events WHERE id = $1", [event_id]);
}

function validateCreateEventFields(createRequest: CreateEventRequest) {
  // Check fields
  if (!createRequest.name || !createRequest.date || !createRequest.time || !createRequest.total_tickets || !createRequest.tickets_remaining || !createRequest.ticket_price) {
    throw new Error("Required fields: (name, date, time, total tickets, tickets remaining, and ticket price)");
  }


  if (!createRequest.name || createRequest.name.length > 100)
    throw new Error("Name must be between 1-100 characters.");

  // TODO: Implement image functiionality

  if (createRequest.description && createRequest.description.length > 500)
    throw new Error("Description must be between 0-500 characters.");

  if (!createRequest.date || new Date(createRequest.date) <= new Date()) {
    throw new Error("Date must be in the future.");
  }

  if (!createRequest.time) {
    throw new Error("Time is required.");
  }

  const timeSplit = createRequest.time.split(":");

  if (timeSplit.length !== 2) throw new Error("Invalid time format");

  const hour = parseInt(timeSplit[0]);
  const min = parseInt(timeSplit[1]);

  if (isNaN(hour)
    || isNaN(min)
    || hour > 24
    || hour < 0
    || min > 59
    || min < 0
  ) {
    throw new Error("Invalid time.");
  }

  if (!createRequest.total_tickets || createRequest.total_tickets === 0)
    throw new Error("Total Tickets is required.");

  if (!createRequest.tickets_remaining || createRequest.tickets_remaining > createRequest.total_tickets)
    throw new Error("Tickets remaining is required and cannot be more than total tickets.");

  if (!createRequest.ticket_price || createRequest.ticket_price < 0) {
    throw new Error("Ticket price is required and cannot be negative.");
  }
}
