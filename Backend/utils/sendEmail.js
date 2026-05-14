// /// file location: Final_Year_Project/Backend/utils/sendEmail.js
// const nodemailer = require("nodemailer");

// const sendEmail = async (to, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   await transporter.sendMail({
//     from: `"FloraVerse Admin" <${process.env.EMAIL}>`,
//     to,
//     subject,
//     html,
//   });
// };

// module.exports = sendEmail;


// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!to) {
      console.log("❌ No recipient email provided");
      return;
    }

    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"FloraVerse 🌿" <${process.env.EMAIL}>`,
      to,
      subject,
      text,   // plain text fallback
      html,   // optional HTML
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

module.exports = sendEmail;