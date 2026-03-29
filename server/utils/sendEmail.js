const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using basic SMTP settings
  // In a real production app, you would configure actual SMTP credentials via environment variables.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'user',
      pass: process.env.SMTP_PASSWORD || 'password'
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Rookierise'} <${process.env.FROM_EMAIL || 'noreply@rookierise.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
