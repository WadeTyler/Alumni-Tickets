import type {PurchaseTicketsRequest, Ticket, TicketWithEventDetails} from "../types/ticket.types.ts";
import {
  attemptPurchaseTickets,
  attemptUseTicket,
  findTicketByCode,
  findTicketByCodeJoinEvent
} from "../utils/ticket.util.ts";
import type {User} from "../types/auth.types.ts";
import {generateTicketQRCode} from "../utils/qrcode.util.ts";
import {sendTicketsEmail} from "../utils/emailjs.util.ts";
import type {EventType} from "../types/event.types.ts";
import {findEventById} from "../utils/event.util.ts";

export const purchaseTicket = async (req: any, res: any) => {
  const purchaseRequest: PurchaseTicketsRequest = req.body;

  try {
    const event: EventType = await findEventById(purchaseRequest.event_id);
    if (!event) throw new Error("Event not found.");

    const tickets: TicketWithEventDetails[] = await attemptPurchaseTickets(purchaseRequest);

    // Send email with tickets
    await sendTicketsEmail(tickets, event.ticket_price * purchaseRequest.quantity, purchaseRequest.email);

    return res.status(201).json({message: "Tickets purchased successfully.", tickets});
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: e.message || "Something went wrong. Try again later."});
  }
}

export const useTicket = async (req: any, res: any) => {
  const code: string = req.params.code;
  const user: User = req.body.user;

  if (!code)
    return res.status(400).json({message: "Code is required."});

  try {
    const ticket = await attemptUseTicket(code, user);
    return res.status(200).json({message: "Ticket is VALID. Ticket has now been used.", ticket});
  } catch (e) {
    return res.status(400).json({message: e.message});
  }
}

export const getTicketByCode = async (req: any, res: any) => {
  const code: string = req.params.code;

  if (!code)
    return res.status(400).json({message: "Code is required."});

  const ticket: Ticket = await findTicketByCode(code);
  if (!ticket)
    return res.status(404).json({message: "Ticket not found."});

  return res.status(200).json({message: "Ticket retrieved successfully.", ticket});
}

export const getTicketsByCodes = async (req: any, res: any) => {
  const codesStr: string = req.query.codes;

  if (!codesStr) {
    return res.status(400).json({ message: "No codes provided." });
  }

  const codes: string[] = codesStr.split(",").map(code => code.trim());

  if (!codes) {
    return res.status(400).json({ message: "No valid codes found." });
  }

  const tickets: Ticket[] = [];

  for (let i = 0; i < codes.length; i++) {
    const ticket = await findTicketByCodeJoinEvent(codes[i]);
    if (!ticket) {
      return res.status(404).json({ message: `Ticket with code ${codes[i]} not found.` });
    }
    if (tickets.find(t => t.code === ticket.code)) {
      return res.status(400).json({ message: `Duplicate ticket code found: ${ticket.code}.` });
    }

    ticket.qr_code = await generateTicketQRCode(ticket.code);

    // Add to stack of tickets
    tickets.push(ticket);
  }

  return res.status(200).json({ message: "Tickets retrieved successfully.", tickets });
}