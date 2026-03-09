const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const forumController = require("../controllers/forumController");

/* =========================
   THREAD ROUTES
========================= */

// Create a new thread
router.post("/threads", auth, forumController.createThread);

// Get all threads with pagination & sorting
// ?page=1&limit=10&sort=new|top|active
router.get("/threads", forumController.getThreads);

// Get single thread with paginated comments
// ?page=1&limit=20
router.get("/threads/:id", forumController.getThreadById);

// Delete a thread (author or admin)
router.delete("/threads/:id", auth, forumController.deleteThread);


/* =========================
   COMMENT ROUTES
========================= */

// Add a comment or reply to a thread
// Include parentComment in body for nested reply
router.post("/threads/:id/comments", auth, forumController.addComment);

// Delete a comment (author or admin)
router.delete("/comments/:id", auth, forumController.deleteComment);


/* =========================
   VOTING ROUTE
========================= */

// Vote on a thread or comment
// body: { targetType: 'thread'|'comment', targetId, value: 1|-1 }
router.post("/vote", auth, forumController.vote);


module.exports = router;
