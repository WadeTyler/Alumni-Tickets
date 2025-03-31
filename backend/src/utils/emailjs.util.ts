import emailjs from "../config/emailjs.config.js";
import type {TicketWithEventDetails} from "../types/ticket.types.js";

const serviceId = process.env.EMAILJS_SERVICE_ID as string;
const templateId = process.env.EMAILJS_TEMPLATE_ID as string;
const qrCodeUrl = (process.env.ENVIRONMENT as string) === 'PRODUCTION' ? (process.env.QRCODE_URL as string) : 'http://localhost:4200/tickets';

export async function sendTicketsEmail(tickets: TicketWithEventDetails[], pricePaid: number, email: string) {

  // Only send emails in production
  if (process.env.ENVIRONMENT !== 'PRODUCTION') {
    return;
  }

  let urls = `${qrCodeUrl}?codes=`;

  tickets.forEach((ticket) => {
    ticket.url = `${qrCodeUrl}?codes=${ticket.code}`
    urls += `${ticket.code},`;
  });

  // Remove the last comma
  urls = urls.slice(0, -1);

  const templateParams = {
    allTicketsUrl: urls,
    tickets: tickets,
    pricePaid: pricePaid,
    email: email,
  };

  const response = await emailjs.send(serviceId, templateId, templateParams);

  if (response.status === 200) {
    console.log("Email sent successfully");
  } else {
    console.error("Failed to send email", response);
  }
}