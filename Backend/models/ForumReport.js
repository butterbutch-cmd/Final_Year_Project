const mongoose = require("mongoose");

const forumReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    targetType: {
      type: String,
      enum: ["thread", "comment"],
      required: true,
      index: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected"],
      default: "pending",
      index: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    reviewedAt: {
      type: Date,
      default: null
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    }
  },
  { timestamps: true }
);

/* 🚫 Prevent duplicate reports */
forumReportSchema.index(
  { reportedBy: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

module.exports = mongoose.model("ForumReport", forumReportSchema);
