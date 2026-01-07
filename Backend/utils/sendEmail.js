/// file location: Final_Year_Project/Backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"FloraVerse Admin" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
