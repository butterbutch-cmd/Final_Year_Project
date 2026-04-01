// ///file: controllers/adminForumControllers.js
// const Thread = require("../models/Thread");
// const Comment = require("../models/Comment");
// const ForumReport = require("../models/ForumReport");
// const Vote = require("../models/Vote");

// /* =========================================
//    THREAD MANAGEMENT
// ========================================= */

// // Get all threads
// exports.getAllThreads = async (req, res) => {
//   try {
//     const threads = await Thread.find()
//       .populate("author", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: threads.length,
//       threads,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get reported threads only
// exports.getReportedThreads = async (req, res) => {
//   try {
//     const threads = await Thread.find({ reportsCount: { $gt: 0 } })
//       .populate("author", "name email")
//       .populate("reports.user", "name email")
//       .sort({ reportsCount: -1 });

//     res.status(200).json({ success: true, threads });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Hide thread
// exports.hideThread = async (req, res) => {
//   try {
//     const thread = await Thread.findByIdAndUpdate(
//       req.params.id,
//       { isHidden: true },
//       { new: true }
//     );

//     if (!thread) {
//       return res.status(404).json({ success: false, message: "Thread not found" });
//     }

//     res.status(200).json({ success: true, message: "Thread hidden successfully", thread });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Unhide thread
// exports.unhideThread = async (req, res) => {
//   try {
//     const thread = await Thread.findByIdAndUpdate(
//       req.params.id,
//       { isHidden: false },
//       { new: true }
//     );

//     if (!thread) {
//       return res.status(404).json({ success: false, message: "Thread not found" });
//     }

//     res.status(200).json({ success: true, message: "Thread unhidden successfully", thread });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Lock thread
// exports.lockThread = async (req, res) => {
//   try {
//     const thread = await Thread.findByIdAndUpdate(
//       req.params.id,
//       { isLocked: true },
//       { new: true }
//     );

//     if (!thread) {
//       return res.status(404).json({ success: false, message: "Thread not found" });
//     }

//     res.status(200).json({ success: true, message: "Thread locked successfully", thread });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Unlock thread
// exports.unlockThread = async (req, res) => {
//   try {
//     const thread = await Thread.findByIdAndUpdate(
//       req.params.id,
//       { isLocked: false },
//       { new: true }
//     );

//     if (!thread) {
//       return res.status(404).json({ success: false, message: "Thread not found" });
//     }

//     res.status(200).json({ success: true, message: "Thread unlocked successfully", thread });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Soft delete thread
// exports.deleteThread = async (req, res) => {
//   try {
//     const thread = await Thread.findByIdAndUpdate(
//       req.params.id,
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!thread) {
//       return res.status(404).json({ success: false, message: "Thread not found" });
//     }

//     res.status(200).json({ success: true, message: "Thread deleted successfully", thread });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Permanent delete thread — also cleans up comments, votes, and embedded reports
// exports.permanentDeleteThread = async (req, res) => {
//   try {
//     const deleted = await Thread.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "Thread not found" });
//     }

//     await Comment.deleteMany({ thread: req.params.id });

//     await Vote.deleteMany({ targetType: "thread", targetId: req.params.id });

//     // Clean up ForumReport collection too (safe even if empty)
//     await ForumReport.deleteMany({ targetType: "thread", targetId: req.params.id });

//     res.status(200).json({ success: true, message: "Thread permanently deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* =========================================
//    COMMENT MANAGEMENT
// ========================================= */

// // Get all comments
// exports.getAllComments = async (req, res) => {
//   try {
//     const comments = await Comment.find()
//       .populate("author", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, comments });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get reported comments only
// exports.getReportedComments = async (req, res) => {
//   try {
//     const comments = await Comment.find({ reportsCount: { $gt: 0 } })
//       .populate("author", "name email")
//       .populate("reports.user", "name email")
//       .sort({ reportsCount: -1 });

//     res.status(200).json({ success: true, comments });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Hide comment
// exports.hideComment = async (req, res) => {
//   try {
//     const comment = await Comment.findByIdAndUpdate(
//       req.params.id,
//       { isHidden: true },
//       { new: true }
//     );

//     if (!comment) {
//       return res.status(404).json({ success: false, message: "Comment not found" });
//     }

//     res.status(200).json({ success: true, message: "Comment hidden successfully", comment });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Soft delete comment
// exports.deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findByIdAndUpdate(
//       req.params.id,
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!comment) {
//       return res.status(404).json({ success: false, message: "Comment not found" });
//     }

//     res.status(200).json({ success: true, message: "Comment deleted successfully", comment });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* =========================================
//    REPORT MANAGEMENT
   
//    Reports are stored as embedded arrays inside Thread.reports[]
//    and Comment.reports[]. The ForumReport collection is currently
//    unused by the user-facing report submission flow, so we read
//    from the embedded arrays instead.
// ========================================= */

// // Get all pending reports (from embedded arrays in Thread + Comment)
// exports.getPendingReports = async (req, res) => {
//   try {
//     // Fetch all threads that have at least one embedded report
//     const reportedThreads = await Thread.find({ "reports.0": { $exists: true } })
//       .populate("author", "name email")
//       .populate("reports.user", "name email")
//       .select("reports title reportsCount");

//     // Flatten each thread's reports array into individual report objects
//     const threadReports = reportedThreads.flatMap((thread) =>
//       thread.reports.map((r) => ({
//         _id: r._id,
//         targetType: "thread",
//         targetId: thread._id,
//         targetTitle: thread.title,
//         reason: r.reason,
//         reportedBy: r.user, // populated { _id, name, email }
//         status: "pending",
//         createdAt: r.createdAt,
//       }))
//     );

//     // Fetch all comments that have at least one embedded report
//     const reportedComments = await Comment.find({ "reports.0": { $exists: true } })
//       .populate("author", "name email")
//       .populate("reports.user", "name email")
//       .select("reports content reportsCount");

//     // Flatten each comment's reports array into individual report objects
//     const commentReports = reportedComments.flatMap((comment) =>
//       comment.reports.map((r) => ({
//         _id: r._id,
//         targetType: "comment",
//         targetId: comment._id,
//         targetContent: comment.content?.slice(0, 100),
//         reason: r.reason,
//         reportedBy: r.user,
//         status: "pending",
//         createdAt: r.createdAt,
//       }))
//     );

//     // Merge and sort newest first
//     const reports = [...threadReports, ...commentReports].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     res.status(200).json({ success: true, reports });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Review a report — removes the embedded sub-document from Thread or Comment
// exports.reviewReport = async (req, res) => {
//   try {
//     const reportId = req.params.id;

//     // Try Thread.reports first
//     const thread = await Thread.findOneAndUpdate(
//       { "reports._id": reportId },
//       {
//         $pull: { reports: { _id: reportId } },
//         $inc: { reportsCount: -1 },
//       },
//       { new: true }
//     );

//     if (thread) {
//       return res.status(200).json({
//         success: true,
//         message: "Thread report marked as reviewed",
//       });
//     }

//     // Otherwise try Comment.reports
//     const comment = await Comment.findOneAndUpdate(
//       { "reports._id": reportId },
//       {
//         $pull: { reports: { _id: reportId } },
//         $inc: { reportsCount: -1 },
//       },
//       { new: true }
//     );

//     if (comment) {
//       return res.status(200).json({
//         success: true,
//         message: "Comment report marked as reviewed",
//       });
//     }

//     return res.status(404).json({ success: false, message: "Report not found" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Reject a report — same as review, removes the embedded sub-document
// exports.rejectReport = async (req, res) => {
//   try {
//     const reportId = req.params.id;

//     // Try Thread.reports first
//     const thread = await Thread.findOneAndUpdate(
//       { "reports._id": reportId },
//       {
//         $pull: { reports: { _id: reportId } },
//         $inc: { reportsCount: -1 },
//       },
//       { new: true }
//     );

//     if (thread) {
//       return res.status(200).json({
//         success: true,
//         message: "Thread report rejected",
//       });
//     }

//     // Otherwise try Comment.reports
//     const comment = await Comment.findOneAndUpdate(
//       { "reports._id": reportId },
//       {
//         $pull: { reports: { _id: reportId } },
//         $inc: { reportsCount: -1 },
//       },
//       { new: true }
//     );

//     if (comment) {
//       return res.status(200).json({
//         success: true,
//         message: "Comment report rejected",
//       });
//     }

//     return res.status(404).json({ success: false, message: "Report not found" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// /* =========================================
//    DASHBOARD ANALYTICS
// ========================================= */

// exports.getForumStats = async (req, res) => {
//   try {
//     const totalThreads = await Thread.countDocuments();
//     const totalComments = await Comment.countDocuments();

//     // Aggregate the total number of embedded reports across all threads
//     const threadReportAgg = await Thread.aggregate([
//       { $project: { count: { $size: { $ifNull: ["$reports", []] } } } },
//       { $group: { _id: null, total: { $sum: "$count" } } },
//     ]);

//     // Aggregate the total number of embedded reports across all comments
//     const commentReportAgg = await Comment.aggregate([
//       { $project: { count: { $size: { $ifNull: ["$reports", []] } } } },
//       { $group: { _id: null, total: { $sum: "$count" } } },
//     ]);

//     const threadReportCount = threadReportAgg[0]?.total || 0;
//     const commentReportCount = commentReportAgg[0]?.total || 0;
//     const pendingReports = threadReportCount + commentReportCount;

//     res.status(200).json({
//       success: true,
//       stats: {
//         totalThreads,
//         totalComments,
//         totalReports: pendingReports,
//         pendingReports,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


///file: controllers/adminForumControllers.js
const Thread = require("../models/Thread");
const Comment = require("../models/Comment");
const ForumReport = require("../models/ForumReport");
const Vote = require("../models/Vote");

/* =========================================
   THREAD MANAGEMENT
========================================= */

// Get all threads
exports.getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: threads.length,
      threads,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single thread by ID with its full comment tree (for admin review)
exports.getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate("author", "name email")
      .populate("reports.user", "name email");

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    // Fetch all comments for this thread, flat list sorted oldest-first
    // so the frontend can reconstruct nesting if needed
    const comments = await Comment.find({ thread: req.params.id })
      .populate("author", "name email")
      .populate("reports.user", "name email")
      .sort({ createdAt: 1 });

    // Build a nested tree: top-level comments contain their replies
    const commentMap = {};
    const rootComments = [];

    comments.forEach((c) => {
      commentMap[c._id.toString()] = { ...c.toObject(), replies: [] };
    });

    comments.forEach((c) => {
      if (c.parentComment) {
        const parent = commentMap[c.parentComment.toString()];
        if (parent) {
          parent.replies.push(commentMap[c._id.toString()]);
        } else {
          // Parent was deleted or missing — show at root level anyway
          rootComments.push(commentMap[c._id.toString()]);
        }
      } else {
        rootComments.push(commentMap[c._id.toString()]);
      }
    });

    res.status(200).json({
      success: true,
      thread,
      comments: rootComments,
      totalComments: comments.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reported threads only
exports.getReportedThreads = async (req, res) => {
  try {
    const threads = await Thread.find({ reportsCount: { $gt: 0 } })
      .populate("author", "name email")
      .populate("reports.user", "name email")
      .sort({ reportsCount: -1 });

    res.status(200).json({ success: true, threads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Hide thread
exports.hideThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    res.status(200).json({ success: true, message: "Thread hidden successfully", thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unhide thread
exports.unhideThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { isHidden: false },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    res.status(200).json({ success: true, message: "Thread unhidden successfully", thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lock thread
exports.lockThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { isLocked: true },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    res.status(200).json({ success: true, message: "Thread locked successfully", thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unlock thread
exports.unlockThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { isLocked: false },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    res.status(200).json({ success: true, message: "Thread unlocked successfully", thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete thread
exports.deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    res.status(200).json({ success: true, message: "Thread deleted successfully", thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Permanent delete thread — also cleans up comments, votes, and embedded reports
exports.permanentDeleteThread = async (req, res) => {
  try {
    const deleted = await Thread.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Thread not found" });
    }

    await Comment.deleteMany({ thread: req.params.id });
    await Vote.deleteMany({ targetType: "thread", targetId: req.params.id });
    await ForumReport.deleteMany({ targetType: "thread", targetId: req.params.id });

    res.status(200).json({ success: true, message: "Thread permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* =========================================
   COMMENT MANAGEMENT
========================================= */

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single comment with its parent thread + direct replies (for admin review)
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author", "name email")
      .populate("reports.user", "name email")
      .populate("parentComment", "content author");

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Get the parent thread so admin has context
    const thread = await Thread.findById(comment.thread)
      .populate("author", "name email")
      .select("title content author createdAt isHidden isLocked isDeleted tags score");

    // Get direct replies to this comment
    const replies = await Comment.find({ parentComment: req.params.id })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    // If this comment is itself a reply, fetch sibling comments for context
    let siblings = [];
    if (comment.parentComment) {
      siblings = await Comment.find({
        parentComment: comment.parentComment,
        _id: { $ne: comment._id },
      })
        .populate("author", "name email")
        .sort({ createdAt: 1 })
        .limit(10);
    }

    res.status(200).json({
      success: true,
      comment,
      thread,
      replies,
      siblings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reported comments only
exports.getReportedComments = async (req, res) => {
  try {
    const comments = await Comment.find({ reportsCount: { $gt: 0 } })
      .populate("author", "name email")
      .populate("reports.user", "name email")
      .sort({ reportsCount: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Hide comment
exports.hideComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.status(200).json({ success: true, message: "Comment hidden successfully", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    res.status(200).json({ success: true, message: "Comment deleted successfully", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* =========================================
   REPORT MANAGEMENT

   Reports are stored as embedded arrays inside Thread.reports[]
   and Comment.reports[]. The ForumReport collection is currently
   unused by the user-facing report submission flow, so we read
   from the embedded arrays instead.
========================================= */

// Get all pending reports (from embedded arrays in Thread + Comment)
exports.getPendingReports = async (req, res) => {
  try {
    const reportedThreads = await Thread.find({ "reports.0": { $exists: true } })
      .populate("author", "name email")
      .populate("reports.user", "name email")
      .select("reports title reportsCount");

    const threadReports = reportedThreads.flatMap((thread) =>
      thread.reports.map((r) => ({
        _id: r._id,
        targetType: "thread",
        targetId: thread._id,
        targetTitle: thread.title,
        reason: r.reason,
        reportedBy: r.user,
        status: "pending",
        createdAt: r.createdAt,
      }))
    );

    const reportedComments = await Comment.find({ "reports.0": { $exists: true } })
      .populate("author", "name email")
      .populate("reports.user", "name email")
      .select("reports content reportsCount thread");

    const commentReports = reportedComments.flatMap((comment) =>
      comment.reports.map((r) => ({
        _id: r._id,
        targetType: "comment",
        targetId: comment._id,
        targetContent: comment.content?.slice(0, 100),
        threadId: comment.thread,
        reason: r.reason,
        reportedBy: r.user,
        status: "pending",
        createdAt: r.createdAt,
      }))
    );

    const reports = [...threadReports, ...commentReports].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Review a report — removes the embedded sub-document from Thread or Comment
exports.reviewReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const thread = await Thread.findOneAndUpdate(
      { "reports._id": reportId },
      { $pull: { reports: { _id: reportId } }, $inc: { reportsCount: -1 } },
      { new: true }
    );

    if (thread) {
      return res.status(200).json({ success: true, message: "Thread report marked as reviewed" });
    }

    const comment = await Comment.findOneAndUpdate(
      { "reports._id": reportId },
      { $pull: { reports: { _id: reportId } }, $inc: { reportsCount: -1 } },
      { new: true }
    );

    if (comment) {
      return res.status(200).json({ success: true, message: "Comment report marked as reviewed" });
    }

    return res.status(404).json({ success: false, message: "Report not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a report — removes the embedded sub-document
exports.rejectReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const thread = await Thread.findOneAndUpdate(
      { "reports._id": reportId },
      { $pull: { reports: { _id: reportId } }, $inc: { reportsCount: -1 } },
      { new: true }
    );

    if (thread) {
      return res.status(200).json({ success: true, message: "Thread report rejected" });
    }

    const comment = await Comment.findOneAndUpdate(
      { "reports._id": reportId },
      { $pull: { reports: { _id: reportId } }, $inc: { reportsCount: -1 } },
      { new: true }
    );

    if (comment) {
      return res.status(200).json({ success: true, message: "Comment report rejected" });
    }

    return res.status(404).json({ success: false, message: "Report not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* =========================================
   DASHBOARD ANALYTICS
========================================= */

exports.getForumStats = async (req, res) => {
  try {
    const totalThreads = await Thread.countDocuments();
    const totalComments = await Comment.countDocuments();

    const threadReportAgg = await Thread.aggregate([
      { $project: { count: { $size: { $ifNull: ["$reports", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);

    const commentReportAgg = await Comment.aggregate([
      { $project: { count: { $size: { $ifNull: ["$reports", []] } } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]);

    const pendingReports =
      (threadReportAgg[0]?.total || 0) + (commentReportAgg[0]?.total || 0);

    res.status(200).json({
      success: true,
      stats: {
        totalThreads,
        totalComments,
        totalReports: pendingReports,
        pendingReports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};