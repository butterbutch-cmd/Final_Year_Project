const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    subtitle: {
      type: String,
      trim: true
    },

    description: {
      type: String
    },

    image: {
      type: String, // image URL (Cloudinary / S3 / local)
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    oldPrice: {
      type: Number
    },

    onSale: {
      type: Boolean,
      default: false
    },

    trending: {
      type: Boolean,
      default: false
    },

    topPick: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5
    },

    reviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
