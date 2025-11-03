const nodemailer = require('nodemailer');

const getTransporter = () => {
  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured; emails will be logged to console.');
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || 'no-reply@farmconnect.local';
  if (!transporter) {
    console.log('--- Email (dev) ---');
    console.log({ to, subject, text, html });
    console.log('--- End Email ---');
    return;
  }
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
};

module.exports = { sendEmail };
