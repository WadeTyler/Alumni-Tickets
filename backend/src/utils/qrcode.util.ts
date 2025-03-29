import QRCode from 'qrcode';

const environment = process.env.ENVIRONMENT || 'development';
const ticketQRCodeURL = environment === 'PRODUCTION' ? process.env.QRCODE_URL : 'http://localhost:4200/tickets/';

export async function generateTicketQRCode(text: string) {
  try {
    return QRCode.toDataURL(ticketQRCodeURL + "?codes=" + text);
  } catch (e) {
    console.error("Error generating QR code: ", e);
    return null;
  }
}