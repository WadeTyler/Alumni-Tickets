import type {PurchaseTicketsRequest, Ticket, TicketWithEventDetails} from "../types/ticket.types.ts";
import {isValidEmail} from "./util.js";
import {findEventById} from "./event.util.js";
import db from '../config/db.config.js';
import type {User} from "../types/auth.types.js";
import type {EventType} from "../types/event.types.js";
import {generateTicketQRCode} from "./qrcode.util.js";

export async function attemptPurchaseTickets(purchaseRequest: PurchaseTicketsRequest): Promise<TicketWithEventDetails[]> {
  validatePurchaseRequest(purchaseRequest);

  // Check if event exists
  const event = await findEventById(purchaseRequest.event_id);
  if (!event) throw new Error("Event not found.");

  // Check if sold out
  if (event.tickets_remaining === 0) {
    throw new Error("Event is sold out!");
  }

  // Check if event has available x(quantity) tickets.
  if (event.tickets_remaining < purchaseRequest.quantity) {
    throw new Error("Not enough tickets available.");
  }

  let ticketsRemoved: boolean = false;
  // Remove remaining tickets
  try {
    // Update ticket count (This is done now, to avoid another user purchasing tickets at the same time)
    await db.query("UPDATE events SET tickets_remaining = tickets_remaining - $1 WHERE id = $2", [purchaseRequest.quantity, purchaseRequest.event_id]);
    ticketsRemoved = true;

    // Create Tickets
    const tickets: Ticket[] = [];

    for (let i = 0; i < purchaseRequest.quantity; i++) {
      // Create a new ticket for each one
      const result = await db.query("INSERT INTO tickets(event_id, email, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *", [
       purchaseRequest.event_id,
       purchaseRequest.email,
       purchaseRequest.first_name,
       purchaseRequest.last_name
      ]);

      const ticket: Ticket = result.rows[0];

      ticket.qr_code = await generateTicketQRCode(ticket.code);

      tickets.push(ticket);
    }

    const ticketsWithDetails: TicketWithEventDetails[] = [];

    for (const ticket of tickets) {
      const fullTicket = await findTicketByCodeJoinEvent(ticket.code);
      fullTicket.qr_code = await generateTicketQRCode(ticket.code);
      ticketsWithDetails.push(fullTicket);
    }

    return ticketsWithDetails;
  } catch (e: any) {
    // If we put the tickets on hold and get an error, then add them back.
    if (ticketsRemoved) {
      await db.query("UPDATE events SET tickets_remaining = tickets_remaining + $1 WHERE id = $2", [purchaseRequest.quantity, purchaseRequest.event_id]);
    }
    throw new Error(e);
  }
}

export async function attemptUseTicket(code: string, user: User) {
  const ticket = await findTicketByCode(code);
  // Check if ticket found
  if (!ticket)
    throw new Error("Invalid Ticket. Ticket not found.");

  // Check if already used
  if (ticket.used)
    throw new Error("Invalid Ticket. Ticket already used.");

  // Check if user is creator of event
  const event: EventType = await findEventById(ticket.event_id);
  if (!event) throw new Error("Event not found");

  if (event.creator_id !== user.id) {
    throw new Error("You are not authorized to use this ticket.");
  }

  // Use Ticket
  await db.query("UPDATE tickets SET used = true WHERE id = $1", [ticket.id]);
  ticket.used = true;

  return ticket;
}

function validatePurchaseRequest(request: PurchaseTicketsRequest) {
  if (!request.event_id || isNaN(request.event_id)) {
    throw new Error("Missing or invalid event id.");
  }

  if (!request.email || !isValidEmail(request.email)) {
    throw new Error("Missing or invalid email.");
  }

  if (!request.first_name || request.first_name.length > 50 || !request.last_name || request.last_name.length > 50) {
    throw new Error("First name and last name are required. 0-50 characters each.");
  }

  if (!request.quantity || request.quantity < 0 || request.quantity > 3) {
    throw new Error("Invalid Quantity. Quantity must be between 1-3.");
  }
}

export async function findTicketByCode(code: string): Promise<Ticket | null> {
  const result = await db.query("SELECT * FROM tickets WHERE code = $1", [code]);
  if (result.rows) return result.rows[0];
  else return null;
}

export async function findTicketByCodeJoinEvent(code: string) {
  const result = await db.query("SELECT tickets.*, events.name, events.date, events.time, events.creator_id FROM tickets JOIN events ON tickets.event_id = events.id WHERE tickets.code = $1", [code]);
  if (result.rows) return result.rows[0];
  else return null;
}