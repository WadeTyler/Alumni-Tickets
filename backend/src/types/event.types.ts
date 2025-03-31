
export type EventType = {
  id: number;
  creator_id: string;
  name: string;
  image?: string;
  description: string;
  date: string;
  time: string;
  created_at: string;
  total_tickets: number;
  tickets_remaining: number;
  ticket_price: number;
}

export type CreateEventRequest = {
  name: string;
  image?: string;
  description: string;
  date: string;
  time: string;
  total_tickets: number;
  tickets_remaining: number;
  ticket_price: number;
}