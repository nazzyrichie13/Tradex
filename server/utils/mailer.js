
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,     // your email address
    pass: process.env.MAIL_PASS      // app password (not your normal password)
  }
});

exports.sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Tradex" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
};
