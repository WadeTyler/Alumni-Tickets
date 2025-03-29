export type Ticket = {
  id: number;
  event_id: number;
  email: string;
  first_name: string;
  last_name: string;
  code: string;
  used: boolean;
  qr_code?: string;
  name?: string;
  date?: string;
  time?: string;
}

export type TicketWithEventDetails = {
  id: number;
  event_id: number;
  email: string;
  first_name: string;
  last_name: string;
  code: string;
  used: boolean;
  qr_code: string;
  name: string;
  date: string;
  time: string;
  creator_id: string;
}

export type PurchaseTicketsRequest = {
  event_id: number;
  email: string;
  first_name: string;
  last_name: string;
  quantity: 1 | 2 | 3;
}