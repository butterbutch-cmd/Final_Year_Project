const express = require("express");

const {
  getNotification,
  markAsRead,
  markAllRead,
  deleteNotification,
  getUnreadCount,
  getAdminNotifications,
  markAdminRead,
} = require("../controllers/notificationController");

const auth = require("../middleware/auth");

const router = express.Router();


router.get("/", auth, getNotification);

router.put("/:id/read", auth, markAsRead);

router.put("/read-all", auth, markAllRead);

router.get("/unread-count", auth, getUnreadCount);

router.delete("/:id", auth, deleteNotification);

// Admin notification routes
router.get("/admin", auth, getAdminNotifications);

router.put("/admin/:id/read", auth, markAdminRead);



module.exports = router;