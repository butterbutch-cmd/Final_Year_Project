// models/Department.js
const mongoose = require("mongoose");

/* ==================== PERMISSION SUB-SCHEMA ==================== */
const permissionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

/* ==================== DEPARTMENT SCHEMA ==================== */
const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    // Default permissions for this department
    permissions: {
      products: { type: permissionSchema, default: () => ({}) },
      users: { type: permissionSchema, default: () => ({}) },
      orders: { type: permissionSchema, default: () => ({}) },
      payments: { type: permissionSchema, default: () => ({}) },
      content: { type: permissionSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
