// const Notification = require("../models/Notification");

// const sendNotification = async ({
//   user,
//   title,
//   message,
//   type,
//   link,
//   sendEmail = false,
// }) => {
//   await Notification.create({
//     user,
//     title,
//     message,
//     type,
//     link,
//     sendEmail,
//   });
// };

// module.exports = sendNotification;

const Notification = require("../models/Notification");

const sendNotification = async (params = {}) => {
  const { user, title, message, type, link, sendEmail = false } = params;

  // Debug log — remove once resolved
  console.log("📬 sendNotification received:", { user, title, message, type });

  try {
    if (!user || !title || !message) {
      console.error("❌ sendNotification called with missing fields:", { user, title, message });
      return; // Don't crash the calling route
    }

    await Notification.create({ user, title, message, type, link, sendEmail });
    console.log("✅ Notification saved for user:", user);
  } catch (err) {
    console.error("sendNotification error:", err);
  }
};

module.exports = sendNotification;