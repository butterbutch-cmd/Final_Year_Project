const express = require("express");
const router = express.Router();

const adminForumController = require("../controllers/adminForumControllers");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.use(auth);

// ── Threads ────────────────────────────────────────────────
router.get(
  "/threads",
  checkPermission("community", "view"),
  adminForumController.getAllThreads
);

router.get(
  "/threads/reported",
  checkPermission("community", "view"),
  adminForumController.getReportedThreads
);

router.get(
  "/thread/:id",
  checkPermission("community", "view"),
  adminForumController.getThreadById
);

router.patch(
  "/thread/:id/hide",
  checkPermission("community", "edit"),
  adminForumController.hideThread
);

router.patch(
  "/thread/:id/unhide",
  checkPermission("community", "edit"),
  adminForumController.unhideThread
);

router.patch(
  "/thread/:id/lock",
  checkPermission("community", "edit"),
  adminForumController.lockThread
);

router.patch(
  "/thread/:id/unlock",
  checkPermission("community", "edit"),
  adminForumController.unlockThread
);

router.patch(
  "/thread/:id/delete",
  checkPermission("community", "delete"),
  adminForumController.deleteThread
);

router.delete(
  "/thread/:id/permanent",
  checkPermission("community", "delete"),
  adminForumController.permanentDeleteThread
);

// ── Comments ───────────────────────────────────────────────
router.get(
  "/comments",
  checkPermission("community", "view"),
  adminForumController.getAllComments
);

router.get(
  "/comments/reported",
  checkPermission("community", "view"),
  adminForumController.getReportedComments
);

router.get(
  "/comment/:id",
  checkPermission("community", "view"),
  adminForumController.getCommentById
);

router.patch(
  "/comment/:id/hide",
  checkPermission("community", "edit"),
  adminForumController.hideComment
);

router.patch(
  "/comment/:id/delete",
  checkPermission("community", "delete"),
  adminForumController.deleteComment
);

// ── Reports ────────────────────────────────────────────────
router.get(
  "/reports",
  checkPermission("community", "view"),
  adminForumController.getPendingReports
);

router.patch(
  "/report/:id/review",
  checkPermission("community", "edit"),
  adminForumController.reviewReport
);

router.patch(
  "/report/:id/reject",
  checkPermission("community", "edit"),
  adminForumController.rejectReport
);

// ── Stats ──────────────────────────────────────────────────
router.get(
  "/stats",
  checkPermission("community", "view"),
  adminForumController.getForumStats
);

module.exports = router;