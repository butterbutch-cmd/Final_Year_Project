const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 🏷️ Category for breadcrumb & filtering
    category: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
    },

    // 🖼️ Primary Image
    image: {
      type: String,
      required: true,
    },

    // 🖼️ Secondary Images
    image1: {
      type: String,
    },

    image2: {
      type: String,
    },

    image3: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    onSale: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    topPick: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
