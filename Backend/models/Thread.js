const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    score: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    /* 🔥 REPORT SYSTEM */
    reportsCount: {
      type: Number,
      default: 0,
      index: true,
    },

    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

/* 🔍 Full-text search */
threadSchema.index({ title: "text", content: "text", tags: "text" });

/* ⚡ Sorting optimization */
threadSchema.index({ createdAt: -1 });
threadSchema.index({ score: -1 });
threadSchema.index({ lastActivityAt: -1 });

module.exports = mongoose.model("Thread", threadSchema);