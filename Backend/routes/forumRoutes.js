// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const forumController = require("../controllers/forumController");

// /* =========================
//    THREAD ROUTES
// ========================= */

// // Create a new thread
// router.post("/threads", auth, forumController.createThread);

// // Get all threads with pagination & sorting
// router.get("/threads", forumController.getThreads);

// // Get single thread with paginated comments
// router.get("/threads/:id", forumController.getThreadById);

// // Edit thread
// router.put("/threads/:id", auth, forumController.editThread);

// // Delete a thread (author or admin)
// router.delete("/threads/:id", auth, forumController.deleteThread);

// /* =========================
//    COMMENT ROUTES
// ========================= */

// // Add a comment or reply
// router.post("/threads/:id/comments", auth, forumController.addComment);

// // Edit a comment
// router.put("/comments/:id", auth, forumController.editComment);

// // Delete a comment
// router.delete("/comments/:id", auth, forumController.deleteComment);

// /* =========================
//    VOTING ROUTE
// ========================= */

// // Vote on thread or comment
// router.post("/vote", auth, forumController.vote);

// module.exports = router;


const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const forumController = require("../controllers/forumController");

/* =========================
   THREAD ROUTES
========================= */

router.post("/threads", auth, forumController.createThread);
router.get("/threads", forumController.getThreads);
router.get("/threads/:id", forumController.getThreadById);
router.put("/threads/:id", auth, forumController.editThread);
router.delete("/threads/:id", auth, forumController.deleteThread);

/* =========================
   COMMENT ROUTES
========================= */

router.post("/threads/:id/comments", auth, forumController.addComment);
router.put("/comments/:id", auth, forumController.editComment);
router.delete("/comments/:id", auth, forumController.deleteComment);

/* =========================
   REPORT ROUTE
========================= */

router.post("/reports", auth, forumController.reportTarget);

/* =========================
   VOTING ROUTE
========================= */

router.post("/vote", auth, forumController.vote);

module.exports = router;