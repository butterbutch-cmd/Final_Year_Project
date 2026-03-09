const Thread = require("../models/Thread");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");

/* ======================================================
   CREATE THREAD
====================================================== */
exports.createThread = async (req, res) => {
  try {
    const { title, content, product, tags } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    const thread = await Thread.create({
      title,
      content,
      author: req.user._id,
      product: product || null,
      tags: tags || [],
      lastActivityAt: Date.now()
    });

    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ message: "Failed to create thread" });
  }
};

/* ======================================================
   GET THREADS (Pagination + Sorting)
   Query params:
   ?page=1&limit=10&sort=new|top|active
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
      isHidden: false
    })
      .populate("author", "username profilePic")
      .populate("product", "name price")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Thread.countDocuments({
      isDeleted: false,
      isHidden: false
    });

    res.json({
      threads,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch threads" });
  }
};

/* ======================================================
   GET SINGLE THREAD + PAGINATED COMMENTS
   ?page=1&limit=20
====================================================== */
exports.getThreadById = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id)
      .populate("author", "username profilePic")
      .populate("product", "name price");

    if (!thread || thread.isDeleted)
      return res.status(404).json({ message: "Thread not found" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const comments = await Comment.find({
      thread: id,
      isDeleted: false
    })
      .populate("author", "username profilePic")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      thread: id,
      isDeleted: false
    });

    res.json({
      thread,
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit)
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch thread" });
  }
};

/* ======================================================
   ADD COMMENT (Supports Nested Replies)
====================================================== */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // thread id
    const { content, parentComment } = req.body;

    if (!content)
      return res.status(400).json({ message: "Comment content required" });

    const thread = await Thread.findById(id);
    if (!thread || thread.isDeleted)
      return res.status(404).json({ message: "Thread not found" });

    if (thread.isLocked)
      return res.status(403).json({ message: "Thread is locked" });

    let depth = 0;

    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent)
        return res.status(404).json({ message: "Parent comment not found" });

      depth = parent.depth + 1;

      if (depth > 5)
        return res.status(400).json({ message: "Max reply depth reached" });

      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { repliesCount: 1 }
      });
    }

    const comment = await Comment.create({
      thread: id,
      parentComment: parentComment || null,
      author: req.user._id,
      content,
      depth
    });

    await Thread.findByIdAndUpdate(id, {
      $inc: { commentsCount: 1 },
      lastActivityAt: Date.now()
    });

    res.status(201).json(comment);

  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ======================================================
   DELETE COMMENT (Soft Delete)
====================================================== */
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    const isAuthor =
      comment.author.toString() === req.user._id.toString();

    const isAdmin =
      ["admin", "super_admin"].includes(req.user.role);

    if (!isAuthor && !isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    comment.isDeleted = true;
    await comment.save();

    await Thread.findByIdAndUpdate(comment.thread, {
      $inc: { commentsCount: -1 }
    });

    res.json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ======================================================
   DELETE THREAD (Soft Delete)
====================================================== */
exports.deleteThread = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id);
    if (!thread)
      return res.status(404).json({ message: "Thread not found" });

    const isAuthor =
      thread.author.toString() === req.user._id.toString();

    const isAdmin =
      ["admin", "super_admin"].includes(req.user.role);

    if (!isAuthor && !isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    thread.isDeleted = true;
    await thread.save();

    res.json({ message: "Thread deleted" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ======================================================
   VOTE (Atomic + Safe)
====================================================== */
exports.vote = async (req, res) => {
  try {
    const { targetType, targetId, value } = req.body;

    if (!["thread", "comment"].includes(targetType))
      return res.status(400).json({ message: "Invalid target type" });

    if (![1, -1].includes(value))
      return res.status(400).json({ message: "Vote must be 1 or -1" });

    const Model = targetType === "thread" ? Thread : Comment;

    const target = await Model.findById(targetId);
    if (!target || target.isDeleted)
      return res.status(404).json({ message: "Target not found" });

    const existingVote = await Vote.findOne({
      user: req.user._id,
      targetType,
      targetId
    });

    if (!existingVote) {
      await Vote.create({
        user: req.user._id,
        targetType,
        targetId,
        value
      });

      await Model.findByIdAndUpdate(targetId, {
        $inc: { score: value }
      });

      return res.json({ message: "Vote added" });
    }

    if (existingVote.value === value) {
      await existingVote.deleteOne();

      await Model.findByIdAndUpdate(targetId, {
        $inc: { score: -value }
      });

      return res.json({ message: "Vote removed" });
    }

    await existingVote.updateOne({ value });

    await Model.findByIdAndUpdate(targetId, {
      $inc: { score: value * 2 }
    });

    res.json({ message: "Vote updated" });

  } catch (err) {
    res.status(500).json({ message: "Voting failed" });
  }
};
