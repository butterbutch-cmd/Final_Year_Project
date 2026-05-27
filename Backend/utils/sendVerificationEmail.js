///file: Backend/utils/sendVerificationEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // App password from .env
  },
});

const sendVerificationEmail = async (toEmail, otp, username) => {
  const mailOptions = {
    from: `"FLORAVERSE 🌿" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: "Verify your FLORAVERSE account",
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: auto; padding: 40px 32px; background: #fdfcf8; border: 1px solid #e8e4dc;">
        <h1 style="font-family: 'Cormorant Garamond', serif; color: #1a3320; font-weight: 300; font-size: 32px; margin: 0 0 8px;">
          Welcome, ${username}
        </h1>
        <p style="color: #8c8880; font-size: 14px; margin: 0 0 32px;">
          Use the code below to verify your email. It expires in <strong>10 minutes</strong>.
        </p>

        <div style="background: #1a3320; color: #f7f4ee; letter-spacing: 0.3em; font-size: 32px;
                    text-align: center; padding: 24px; border-radius: 4px; margin-bottom: 32px;">
          ${otp}
        </div>

        <p style="color: #8c8880; font-size: 12px; margin: 0;">
          If you didn't create a Mendho account, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;