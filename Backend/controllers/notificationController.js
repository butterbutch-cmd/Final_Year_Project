const Notification = require("../models/Notification");

// Get user notifications + unread count
const getNotification = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = { user: req.user._id };

    // ONLY forum notifications
    if (type === "forum") {
      filter.type = { $in: ["forum_reply", "forum_like"] };
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }),
      Notification.countDocuments({
        ...filter,
        isRead: false,
      }),
    ]);

    res.json({ notifications, unreadCount });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark one as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all as read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete one
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications for admins (low_stock etc.)
const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark one admin notification as read
const markAdminRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Not found" });

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotification,
  markAsRead,
  markAllRead,
  deleteNotification,
  getUnreadCount,
  getAdminNotifications,
  markAdminRead,
};