// models/Module.js
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },      // e.g., "products"
  label: { type: String, required: true },                    // e.g., "Product Management"
  defaultPermissions: {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);