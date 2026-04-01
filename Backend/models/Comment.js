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

    /* 📊 Number of replies */
    repliesCount: {
      type: Number,
      default: 0
    },

    /* 🧱 Depth */
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

    /* 🔥 REPORT SYSTEM */
    reportsCount: {
      type: Number,
      default: 0,
      index: true
    },

    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        reason: {
          type: String,
          required: true,
          trim: true
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

/* 🔍 Optimized compound index */
commentSchema.index({ thread: 1, parentComment: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);