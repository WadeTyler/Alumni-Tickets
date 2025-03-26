import type {PurchaseTicketsRequest, Ticket} from "../../../types/ticket.types.ts";
import {attemptPurchaseTickets, attemptUseTicket, findTicketByCode} from "../utils/ticket.util.ts";
import type {User} from "../../../types/auth.types.ts";

export const purchaseTicket = async (req: any, res: any) => {
  const purchaseRequest: PurchaseTicketsRequest = req.body;

  try {
    const tickets: Ticket[] = await attemptPurchaseTickets(purchaseRequest);
    return res.status(201).json({message: "Tickets purchased successfully.", tickets});
  } catch (e) {
    return res.status(400).json({message: e.message});
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