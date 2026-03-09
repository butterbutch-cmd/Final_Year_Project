const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    /* 🔗 Always belongs to a thread */
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
      index: true
    },

    /* 🌳 Enables nested replies (Reddit-style) */
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true
    },

    /* 👤 Who wrote the comment */
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* 📝 Content */
    content: {
      type: String,
      required: true,
      trim: true
    },

    /* ⭐ Voting score */
    score: {
      type: Number,
      default: 0,
      index: true
    },

    /* 📊 Number of replies (for performance optimization) */
    repliesCount: {
      type: Number,
      default: 0
    },

    /* 🧱 Optional depth limiter (helps prevent 50-level nesting) */
    depth: {
      type: Number,
      default: 0
    },

    /* 🛡 Moderation fields */
    isDeleted: {
      type: Boolean,
      default: false
    },

    isHidden: {
      type: Boolean,
      default: false
    },

    reportsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

/* 🔍 Optimized compound index for nested loading */
commentSchema.index({ thread: 1, parentComment: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
