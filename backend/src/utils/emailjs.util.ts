import emailjs from "../config/emailjs.config.ts";
import type {TicketWithEventDetails} from "../../../types/ticket.types.ts";

const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;
const qrCodeUrl = process.env.ENVIRONMENT === 'PRODUCTION' ? process.env.QRCODE_URL : 'http://localhost:4200/tickets';

export async function sendTicketsEmail(tickets: TicketWithEventDetails[], pricePaid: number, email: string) {

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