import emailjs from '@emailjs/nodejs';

const privateKey = process.env.EMAILJS_PRIVATE_KEY;
const publicKey = process.env.EMAILJS_PUBLIC_KEY;

emailjs.init({
  publicKey: publicKey,
  privateKey: privateKey,
});

export default emailjs;