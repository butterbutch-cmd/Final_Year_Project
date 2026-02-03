const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String },

    // Separate image fields instead of array
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },

    price: { type: Number, required: true },
    oldPrice: { type: Number },
    stock: { type: Number, required: true, min: 0, default: 0 },
    tags: [{ type: String, trim: true }],
    onSale: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    topPick: { type: Boolean, default: false },

    care: {
      level: { type: String, default: "Easy" },
      levelPercent: { type: Number, default: 33 },
      sunlight: { type: String, default: "Partial" },
      water: { type: String, default: "Weekly" },
      temp: { type: String, default: "18-30°C" },
      tips: [{ type: String }]
    },

    potOptions: [
      {
        id: { type: String },
        label: { type: String },
        price: { type: Number, default: 0 }
      }
    ],

    policies: {
      shipping: { type: String },
      returns: { type: String },
      sustainability: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
