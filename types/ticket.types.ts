export type Ticket = {
  id: number;
  event_id: number;
  email: string;
  first_name: string;
  last_name: string;
  code: string;
  used: boolean;
}

export type PurchaseTicketsRequest = {
  event_id: number;
  email: string;
  first_name: string;
  last_name: string;
  quantity: 1 | 2 | 3;
}