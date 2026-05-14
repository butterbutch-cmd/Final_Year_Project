// ///file location: Backend/controllers/forumController.js
// const Thread = require("../models/Thread");
// const Comment = require("../models/Comment");
// const Vote = require("../models/Vote");

// /* ======================================================
//    CREATE THREAD
// ====================================================== */
// exports.createThread = async (req, res) => {
//   try {
//     const { title, content, product, tags } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ message: "Title and content required" });
//     }

//     const thread = await Thread.create({
//       title,
//       content,
//       author: req.user._id,
//       product: product || null,
//       tags: tags || [],
//       lastActivityAt: Date.now(),
//     });

//     try {
//       const io = req.app.get("io");
//       if (io) {
//         io.emit("thread:created", { thread });
//       }
//     } catch (e) {
//       console.warn("Emit thread:created failed:", e.message);
//     }

//     res.status(201).json(thread);
//   } catch (err) {
//     console.error("createThread error:", err);
//     res.status(500).json({ message: "Failed to create thread" });
//   }
// };

// /* ======================================================
//    GET THREADS
// ====================================================== */
// exports.getThreads = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const sortType = req.query.sort || "new";

//     let sortOption = { createdAt: -1 };
//     if (sortType === "top") sortOption = { score: -1 };
//     if (sortType === "active") sortOption = { lastActivityAt: -1 };

//     const threads = await Thread.find({
//       isDeleted: false,
//       isHidden: false,
//     })
//       .populate("author", "username profilePic")
//       .populate("product", "name price")
//       .sort(sortOption)
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await Thread.countDocuments({
//       isDeleted: false,
//       isHidden: false,
//     });

//     res.json({
//       threads,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     console.error("getThreads error:", err);
//     res.status(500).json({ message: "Failed to fetch threads" });
//   }
// };

// /* ======================================================
//    GET SINGLE THREAD + COMMENTS
// ====================================================== */
// exports.getThreadById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const thread = await Thread.findById(id)
//       .populate("author", "username profilePic")
//       .populate("product", "name price");

//     if (!thread || thread.isDeleted) {
//       return res.status(404).json({ message: "Thread not found" });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 200;

//     const comments = await Comment.find({
//       thread: id,
//       isDeleted: false,
//     })
//       .populate("author", "username profilePic")
//       .populate({
//         path: "parentComment",
//         populate: { path: "author", select: "username profilePic" },
//       })
//       .sort({ createdAt: 1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalComments = await Comment.countDocuments({
//       thread: id,
//       isDeleted: false,
//     });

//     res.json({
//       thread,
//       comments,
//       currentPage: page,
//       totalPages: Math.ceil(totalComments / limit),
//     });
//   } catch (err) {
//     console.error("getThreadById error:", err);
//     res.status(500).json({ message: "Failed to fetch thread" });
//   }
// };

// /* ======================================================
//    ADD COMMENT
// ====================================================== */
// exports.addComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { content, parentComment } = req.body;

//     if (!content) {
//       return res.status(400).json({ message: "Comment content required" });
//     }

//     const thread = await Thread.findById(id);
//     if (!thread || thread.isDeleted) {
//       return res.status(404).json({ message: "Thread not found" });
//     }

//     if (thread.isLocked) {
//       return res.status(403).json({ message: "Thread is locked" });
//     }

//     let depth = 0;

//     if (parentComment) {
//       const parent = await Comment.findById(parentComment);
//       if (!parent) {
//         return res.status(404).json({ message: "Parent comment not found" });
//       }

//       depth = parent.depth + 1;

//       if (depth > 10) {
//         return res.status(400).json({ message: "Max reply depth reached" });
//       }

//       await Comment.findByIdAndUpdate(parentComment, {
//         $inc: { repliesCount: 1 },
//       });
//     }

//     const comment = await Comment.create({
//       thread: id,
//       parentComment: parentComment || null,
//       author: req.user._id,
//       content,
//       depth,
//     });

//     await Thread.findByIdAndUpdate(id, {
//       $inc: { commentsCount: 1 },
//       lastActivityAt: Date.now(),
//     });

//     const populated = await Comment.findById(comment._id)
//       .populate("author", "username profilePic")
//       .populate({
//         path: "parentComment",
//         populate: { path: "author", select: "username profilePic" },
//       });

//     try {
//       const io = req.app.get("io");
//       if (io) {
//         io.to(`thread:${id}`).emit("comment:created", {
//           threadId: String(id),
//           comment: populated,
//         });
//       }
//     } catch (e) {
//       console.warn("Failed to emit comment:created:", e.message);
//     }

//     res.status(201).json({ comment: populated });
//   } catch (err) {
//     console.error("addComment error:", err);
//     res.status(500).json({ message: "Failed to add comment" });
//   }
// };

// /* ======================================================
//    EDIT COMMENT
// ====================================================== */
// exports.editComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { content } = req.body;

//     if (!content || !content.trim()) {
//       return res.status(400).json({ message: "Comment content required" });
//     }

//     const comment = await Comment.findById(id);
//     if (!comment || comment.isDeleted) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     const isAuthor = comment.author.toString() === req.user._id.toString();
//     const isAdmin = ["admin", "super_admin"].includes(req.user.role);

//     if (!isAuthor && !isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     comment.content = content.trim();
//     await comment.save();

//     const populated = await Comment.findById(comment._id)
//       .populate("author", "username profilePic")
//       .populate({
//         path: "parentComment",
//         populate: { path: "author", select: "username profilePic" },
//       });

//     try {
//       const io = req.app.get("io");
//       if (io) {
//         io.to(`thread:${String(comment.thread)}`).emit("comment:updated", {
//           threadId: String(comment.thread),
//           comment: populated,
//         });
//       }
//     } catch (e) {
//       console.warn("Failed to emit comment:updated:", e.message);
//     }

//     res.json({ comment: populated });
//   } catch (err) {
//     console.error("editComment error:", err);
//     res.status(500).json({ message: "Failed to update comment" });
//   }
// };

// /* ======================================================
//    DELETE COMMENT
// ====================================================== */
// exports.deleteComment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const comment = await Comment.findById(id);
//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     const isAuthor = comment.author.toString() === req.user._id.toString();
//     const isAdmin = ["admin", "super_admin"].includes(req.user.role);

//     if (!isAuthor && !isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     comment.isDeleted = true;
//     await comment.save();

//     await Thread.findByIdAndUpdate(comment.thread, {
//       $inc: { commentsCount: -1 },
//     });

//     try {
//       const io = req.app.get("io");
//       if (io) {
//         io.to(`thread:${String(comment.thread)}`).emit("comment:deleted", {
//           threadId: String(comment.thread),
//           commentId: String(comment._id),
//         });
//       }
//     } catch (e) {
//       console.warn("Failed to emit comment:deleted:", e.message);
//     }

//     res.json({ message: "Comment deleted" });
//   } catch (err) {
//     console.error("deleteComment error:", err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// };

// /* ======================================================
//    DELETE THREAD
// ====================================================== */
// exports.deleteThread = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const thread = await Thread.findById(id);
//     if (!thread) {
//       return res.status(404).json({ message: "Thread not found" });
//     }

//     const isAuthor = thread.author.toString() === req.user._id.toString();
//     const isAdmin = ["admin", "super_admin"].includes(req.user.role);

//     if (!isAuthor && !isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     thread.isDeleted = true;
//     await thread.save();

//     try {
//       const io = req.app.get("io");
//       if (io) {
//         io.emit("thread:deleted", { threadId: String(id) });
//       }
//     } catch (e) {
//       console.warn("Failed to emit thread:deleted:", e.message);
//     }

//     res.json({ message: "Thread deleted" });
//   } catch (err) {
//     console.error("deleteThread error:", err);
//     res.status(500).json({ message: "Delete failed" });
//   }
// };

// /* ======================================================
//    VOTE
// ====================================================== */
// exports.vote = async (req, res) => {
//   try {
//     const { targetType, targetId, value } = req.body;

//     if (!["thread", "comment"].includes(targetType)) {
//       return res.status(400).json({ message: "Invalid target type" });
//     }

//     if (![1, -1].includes(value)) {
//       return res.status(400).json({ message: "Vote must be 1 or -1" });
//     }

//     const Model = targetType === "thread" ? Thread : Comment;

//     const target = await Model.findById(targetId);
//     if (!target || target.isDeleted) {
//       return res.status(404).json({ message: "Target not found" });
//     }

//     const existingVote = await Vote.findOne({
//       user: req.user._id,
//       targetType,
//       targetId,
//     });

//     if (!existingVote) {
//       await Vote.create({
//         user: req.user._id,
//         targetType,
//         targetId,
//         value,
//       });

//       await Model.findByIdAndUpdate(targetId, {
//         $inc: { score: value },
//       });

//       return res.json({ message: "Vote added" });
//     }

//     if (existingVote.value === value) {
//       await existingVote.deleteOne();

//       await Model.findByIdAndUpdate(targetId, {
//         $inc: { score: -value },
//       });

//       return res.json({ message: "Vote removed" });
//     }

//     await existingVote.updateOne({ value });

//     await Model.findByIdAndUpdate(targetId, {
//       $inc: { score: value * 2 },
//     });

//     res.json({ message: "Vote updated" });
//   } catch (err) {
//     console.error("vote error:", err);
//     res.status(500).json({ message: "Voting failed" });
//   }
// };

// /* ======================================================
//    EDIT THREAD
// ====================================================== */
// exports.editThread = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, tags } = req.body;

//     const thread = await Thread.findById(id);

//     if (!thread || thread.isDeleted) {
//       return res.status(404).json({ message: "Thread not found" });
//     }

//     const isAuthor = thread.author.toString() === req.user._id.toString();
//     const isAdmin = ["admin", "super_admin"].includes(req.user.role);

//     if (!isAuthor && !isAdmin) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     if (title !== undefined) thread.title = title;
//     if (content !== undefined) thread.content = content;
//     if (tags !== undefined) thread.tags = tags;

//     thread.lastActivityAt = Date.now();

//     await thread.save();

//     try {
//       const io = req.app.get("io");
//       if (io) {
//         io.emit("thread:updated", { thread });
//       }
//     } catch (e) {
//       console.warn("Emit thread:updated failed:", e.message);
//     }

//     res.json(thread);
//   } catch (err) {
//     console.error("editThread error:", err);
//     res.status(500).json({ message: "Failed to update thread" });
//   }
// };

// /* ======================================================
//    REPORT TARGET
// ====================================================== */
// exports.reportTarget = async (req, res) => {
//   try {
//     const { targetType, targetId, reason } = req.body;

//     if (!["thread", "comment"].includes(targetType)) {
//       return res.status(400).json({ message: "Invalid target type" });
//     }

//     if (!targetId) {
//       return res.status(400).json({ message: "Target id is required" });
//     }

//     if (!reason || !reason.trim()) {
//       return res.status(400).json({ message: "Report reason is required" });
//     }

//     const Model = targetType === "thread" ? Thread : Comment;

//     const target = await Model.findById(targetId);
//     if (!target || target.isDeleted) {
//       return res.status(404).json({ message: "Target not found" });
//     }

//     // Prevent the same user from reporting the same target twice
//     const alreadyReported = target.reports?.some(
//       (r) => r.user.toString() === req.user._id.toString()
//     );

//     if (alreadyReported) {
//       return res.status(409).json({ message: "You have already reported this." });
//     }

//     target.reports.push({
//       user: req.user._id,
//       reason: reason.trim(),
//       createdAt: new Date(),
//     });

//     target.reportsCount = target.reports.length;

//     await target.save();

//     return res.status(200).json({
//       message: `${targetType} reported successfully`,
//       reportsCount: target.reportsCount,
//     });
//   } catch (err) {
//     console.error("reportTarget error:", err);
//     return res.status(500).json({ message: "Failed to report target" });
//   }
// };

///file location: Backend/controllers/forumController.js
const Thread = require("../models/Thread");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const { User } = require("../models/User");   // ✅ FIXED (destructured)
const sendNotification = require("../utils/sendNotification");

/* ======================================================
   CREATE THREAD
====================================================== */
exports.createThread = async (req, res) => {
  try {
    const { title, content, product, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const thread = await Thread.create({
      title,
      content,
      author: req.user._id,
      product: product || null,
      tags: tags || [],
      lastActivityAt: Date.now(),
    });

    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("thread:created", { thread });
      }
    } catch (e) {
      console.warn("Emit thread:created failed:", e.message);
    }

    res.status(201).json(thread);
  } catch (err) {
    console.error("createThread error:", err);
    res.status(500).json({ message: "Failed to create thread" });
  }
};

/* ======================================================
   GET THREADS
====================================================== */
exports.getThreads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortType = req.query.sort || "new";

    let sortOption = { createdAt: -1 };
    if (sortType === "top") sortOption = { score: -1 };
    if (sortType === "active") sortOption = { lastActivityAt: -1 };

    const threads = await Thread.find({
      isDeleted: false,
      isHidden: false,
    })
      .populate("author", "username profilePic")
      .populate("product", "name price")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Thread.countDocuments({
      isDeleted: false,
      isHidden: false,
    });

    res.json({
      threads,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("getThreads error:", err);
    res.status(500).json({ message: "Failed to fetch threads" });
  }
};

/* ======================================================
   GET SINGLE THREAD + COMMENTS
====================================================== */
exports.getThreadById = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id)
      .populate("author", "username profilePic")
      .populate("product", "name price");

    if (!thread || thread.isDeleted) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 200;

    const comments = await Comment.find({
      thread: id,
      isDeleted: false,
    })
      .populate("author", "username profilePic")
      .populate({
        path: "parentComment",
        populate: { path: "author", select: "username profilePic" },
      })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      thread: id,
      isDeleted: false,
    });

    res.json({
      thread,
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
    });
  } catch (err) {
    console.error("getThreadById error:", err);
    res.status(500).json({ message: "Failed to fetch thread" });
  }
};

/* ======================================================
   ADD COMMENT
====================================================== */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentComment } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment content required" });
    }

    // ── Fetch acting user so we have their username ──────────────────────
    const actingUser = await User.findById(req.user._id).select("username");
    if (!actingUser) return res.status(401).json({ message: "User not found" });
    const actingUsername = actingUser.username;

    const thread = await Thread.findById(id).populate("author", "username");
    if (!thread || thread.isDeleted) {
      return res.status(404).json({ message: "Thread not found" });
    }

    if (thread.isLocked) {
      return res.status(403).json({ message: "Thread is locked" });
    }

    let depth = 0;

    if (parentComment) {
      const parent = await Comment.findById(parentComment).populate("author", "username");
      if (!parent) {
        return res.status(404).json({ message: "Parent comment not found" });
      }

      depth = parent.depth + 1;

      if (depth > 10) {
        return res.status(400).json({ message: "Max reply depth reached" });
      }

      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { repliesCount: 1 },
      });

      const parentAuthorId  = String(parent.author._id);
      const replyingUserId  = String(req.user._id);
      const threadAuthorId  = String(thread.author._id);

      // notify parent comment author
      if (parentAuthorId !== replyingUserId) {
        await sendNotification({
          user: parent.author._id,
          title: "Someone replied to your comment",
          message: `${actingUsername} replied to your comment in "${thread.title}"`,
          type: "forum_reply",
          link: `/forum/${id}`,
        });
      }

      // notify thread author
      if (threadAuthorId !== replyingUserId && threadAuthorId !== parentAuthorId) {
        await sendNotification({
          user: thread.author._id,
          title: "New reply on your thread",
          message: `${actingUsername} replied in "${thread.title}"`,
          type: "forum_reply",
          link: `/forum/${id}`,
        });
      }

    } else {
      const threadAuthorId   = String(thread.author._id);
      const commentingUserId = String(req.user._id);

      if (threadAuthorId !== commentingUserId) {
        await sendNotification({
          user: thread.author._id,
          title: "New reply on your thread",
          message: `${actingUsername} commented on "${thread.title}"`,
          type: "forum_reply",
          link: `/forum/${id}`,
        });
      }
    }

    const comment = await Comment.create({
      thread: id,
      parentComment: parentComment || null,
      author: req.user._id,
      content,
      depth,
    });

    await Thread.findByIdAndUpdate(id, {
      $inc: { commentsCount: 1 },
      lastActivityAt: Date.now(),
    });

    const populated = await Comment.findById(comment._id)
      .populate("author", "username profilePic")
      .populate({
        path: "parentComment",
        populate: { path: "author", select: "username profilePic" },
      });

    try {
      const io = req.app.get("io");
      if (io) {
        io.to(`thread:${id}`).emit("comment:created", {
          threadId: String(id),
          comment: populated,
        });
      }
    } catch (e) {
      console.warn("Failed to emit comment:created:", e.message);
    }

    res.status(201).json({ comment: populated });
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ======================================================
   EDIT COMMENT
====================================================== */
exports.editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const comment = await Comment.findById(id);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.content = content.trim();
    await comment.save();

    const populated = await Comment.findById(comment._id)
      .populate("author", "username profilePic")
      .populate({
        path: "parentComment",
        populate: { path: "author", select: "username profilePic" },
      });

    try {
      const io = req.app.get("io");
      if (io) {
        io.to(`thread:${String(comment.thread)}`).emit("comment:updated", {
          threadId: String(comment.thread),
          comment: populated,
        });
      }
    } catch (e) {
      console.warn("Failed to emit comment:updated:", e.message);
    }

    res.json({ comment: populated });
  } catch (err) {
    console.error("editComment error:", err);
    res.status(500).json({ message: "Failed to update comment" });
  }
};

/* ======================================================
   DELETE COMMENT
====================================================== */
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.isDeleted = true;
    await comment.save();

    await Thread.findByIdAndUpdate(comment.thread, {
      $inc: { commentsCount: -1 },
    });

    try {
      const io = req.app.get("io");
      if (io) {
        io.to(`thread:${String(comment.thread)}`).emit("comment:deleted", {
          threadId: String(comment.thread),
          commentId: String(comment._id),
        });
      }
    } catch (e) {
      console.warn("Failed to emit comment:deleted:", e.message);
    }

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ======================================================
   DELETE THREAD
====================================================== */
exports.deleteThread = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const isAuthor = thread.author.toString() === req.user._id.toString();
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    thread.isDeleted = true;
    await thread.save();

    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("thread:deleted", { threadId: String(id) });
      }
    } catch (e) {
      console.warn("Failed to emit thread:deleted:", e.message);
    }

    res.json({ message: "Thread deleted" });
  } catch (err) {
    console.error("deleteThread error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ======================================================
   VOTE
====================================================== */
exports.vote = async (req, res) => {
  try {
    const { targetType, targetId, value } = req.body;

    if (!["thread", "comment"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    if (![1, -1].includes(value)) {
      return res.status(400).json({ message: "Vote must be 1 or -1" });
    }

    // Use the already imported User model from the top of the file
    const actingUser = await User.findById(req.user._id).select("username");
    if (!actingUser) return res.status(401).json({ message: "User not found" });

    const actingUsername = actingUser.username;
    const Model = targetType === "thread" ? Thread : Comment;

    const target = await Model.findById(targetId).populate("author", "username");
    if (!target || target.isDeleted) {
      return res.status(404).json({ message: "Target not found" });
    }

    const voterId = String(req.user._id);
    const targetOwner = String(target.author._id);

    const existingVote = await Vote.findOne({
      user: req.user._id,
      targetType,
      targetId,
    });

    if (!existingVote) {
      await Vote.create({
        user: req.user._id,
        targetType,
        targetId,
        value,
      });

      await Model.findByIdAndUpdate(targetId, { $inc: { score: value } });

      if (value === 1 && voterId !== targetOwner) {
        if (targetType === "thread") {
          await sendNotification({
            user: target.author._id,
            title: "Someone liked your thread",
            message: `${actingUsername} liked your thread "${target.title}"`,
            type: "forum_like",
            link: `/forum/${targetId}`,
          });
        } else {
          const parentThread = await Thread.findById(target.thread).select("title");
          const threadTitle = parentThread?.title || "a thread";
          const threadLink = parentThread ? `/forum/${target.thread}` : `/forum`;

          await sendNotification({
            user: target.author._id,
            title: "Someone liked your comment",
            message: `${actingUsername} liked your comment in "${threadTitle}"`,
            type: "forum_like",
            link: threadLink,
          });
        }
      }

      return res.json({ message: "Vote added" });
    }

    if (existingVote.value === value) {
      await existingVote.deleteOne();
      await Model.findByIdAndUpdate(targetId, { $inc: { score: -value } });
      return res.json({ message: "Vote removed" });
    }

    await existingVote.updateOne({ value });
    await Model.findByIdAndUpdate(targetId, { $inc: { score: value * 2 } });

    return res.json({ message: "Vote updated" });
  } catch (err) {
    console.error("vote error:", err);
    return res.status(500).json({ message: "Voting failed" });
  }
};

/* ======================================================
   EDIT THREAD
====================================================== */
exports.editThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const thread = await Thread.findById(id);

    if (!thread || thread.isDeleted) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const isAuthor = thread.author.toString() === req.user._id.toString();
    const isAdmin = ["admin", "super_admin"].includes(req.user.role);

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (title !== undefined) thread.title = title;
    if (content !== undefined) thread.content = content;
    if (tags !== undefined) thread.tags = tags;

    thread.lastActivityAt = Date.now();

    await thread.save();

    try {
      const io = req.app.get("io");
      if (io) {
        io.emit("thread:updated", { thread });
      }
    } catch (e) {
      console.warn("Emit thread:updated failed:", e.message);
    }

    res.json(thread);
  } catch (err) {
    console.error("editThread error:", err);
    res.status(500).json({ message: "Failed to update thread" });
  }
};

/* ======================================================
   REPORT TARGET
====================================================== */
exports.reportTarget = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;

    if (!["thread", "comment"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid target type" });
    }

    if (!targetId) {
      return res.status(400).json({ message: "Target id is required" });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Report reason is required" });
    }

    const Model = targetType === "thread" ? Thread : Comment;

    const target = await Model.findById(targetId);
    if (!target || target.isDeleted) {
      return res.status(404).json({ message: "Target not found" });
    }

    const alreadyReported = target.reports?.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res.status(409).json({ message: "You have already reported this." });
    }

    target.reports.push({
      user: req.user._id,
      reason: reason.trim(),
      createdAt: new Date(),
    });

    target.reportsCount = target.reports.length;

    await target.save();

    return res.status(200).json({
      message: `${targetType} reported successfully`,
      reportsCount: target.reportsCount,
    });
  } catch (err) {
    console.error("reportTarget error:", err);
    return res.status(500).json({ message: "Failed to report target" });
  }
};