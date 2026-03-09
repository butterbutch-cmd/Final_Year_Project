// models/Department.js
const mongoose = require("mongoose");

const permissionValueSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    // permissions per module
    permissions: {
      type: Map,
      of: permissionValueSchema,
      default: new Map(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
