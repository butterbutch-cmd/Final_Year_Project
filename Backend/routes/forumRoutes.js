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