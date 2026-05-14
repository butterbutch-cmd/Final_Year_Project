// // // const mongoose = require("mongoose");

// // // const productSchema = new mongoose.Schema(
// // //   {
// // //     name: { type: String, required: true, trim: true },
// // //     category: { type: String, required: true, trim: true },
// // //     subtitle: { type: String, trim: true },
// // //     description: { type: String },

// // //     // Separate image fields instead of array
// // //     image1: { type: String },
// // //     image2: { type: String },
// // //     image3: { type: String },

// // //     price: { type: Number, required: true },
// // //     oldPrice: { type: Number },
// // //     stock: { type: Number, required: true, min: 0, default: 0 },
// // //     tags: [{ type: String, trim: true }],
// // //     onSale: { type: Boolean, default: false },
// // //     trending: { type: Boolean, default: false },
// // //     topPick: { type: Boolean, default: false },

// // //     care: {
// // //       level: { type: String, default: "Easy" },
// // //       levelPercent: { type: Number, default: 33 },
// // //       sunlight: { type: String, default: "Partial" },
// // //       water: { type: String, default: "Weekly" },
// // //       temp: { type: String, default: "18-30°C" },
// // //       tips: [{ type: String }]
// // //     },

// // //     potOptions: [
// // //       {
// // //         id: { type: String },
// // //         label: { type: String },
// // //         price: { type: Number, default: 0 }
// // //       }
// // //     ],

// // //     policies: {
// // //       shipping: { type: String },
// // //       returns: { type: String },
// // //       sustainability: { type: String }
// // //     }
// // //   },
// // //   { timestamps: true }
// // // );

// // // module.exports = mongoose.model("Product", productSchema);


// // // Backend/models/Product.js

// // const mongoose = require("mongoose");
// // const sendNotification = require("../utils/sendNotification");
// // const 

// // const productSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true },
// //     category: { type: String, required: true, trim: true },
// //     subtitle: { type: String, trim: true },
// //     description: { type: String },

// //     // Separate image fields instead of array
// //     image1: { type: String },
// //     image2: { type: String },
// //     image3: { type: String },

// //     price: { type: Number, required: true },
// //     oldPrice: { type: Number },
// //     stock: { type: Number, required: true, min: 0, default: 0 },

// //     // ⭐ NEW: Prevents sending the same low‑stock alert multiple times
// //     lowStockNotified: { type: Boolean, default: false },

// //     tags: [{ type: String, trim: true }],
// //     onSale: { type: Boolean, default: false },
// //     trending: { type: Boolean, default: false },
// //     topPick: { type: Boolean, default: false },

// //     care: {
// //       level: { type: String, default: "Easy" },
// //       levelPercent: { type: Number, default: 33 },
// //       sunlight: { type: String, default: "Partial" },
// //       water: { type: String, default: "Weekly" },
// //       temp: { type: String, default: "18-30°C" },
// //       tips: [{ type: String }]
// //     },

// //     potOptions: [
// //       {
// //         id: { type: String },
// //         label: { type: String },
// //         price: { type: Number, default: 0 }
// //       }
// //     ],

// //     policies: {
// //       shipping: { type: String },
// //       returns: { type: String },
// //       sustainability: { type: String }
// //     }
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Product", productSchema);

// // Backend/models/Product.js

// const mongoose = require("mongoose");
// const sendNotification = require("../utils/sendNotification");
// const { User } = require("./User"); // ✅ correct import

// const LOW_STOCK_THRESHOLD = 5;

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     category: { type: String, required: true, trim: true },
//     subtitle: { type: String, trim: true },
//     description: { type: String },

//     // Separate image fields instead of array
//     image1: { type: String },
//     image2: { type: String },
//     image3: { type: String },

//     price: { type: Number, required: true },
//     oldPrice: { type: Number },
//     stock: { type: Number, required: true, min: 0, default: 0 },

//     // Prevent duplicate low-stock alerts
//     lowStockNotified: { type: Boolean, default: false },

//     tags: [{ type: String, trim: true }],
//     onSale: { type: Boolean, default: false },
//     trending: { type: Boolean, default: false },
//     topPick: { type: Boolean, default: false },

//     care: {
//       level: { type: String, default: "Easy" },
//       levelPercent: { type: Number, default: 33 },
//       sunlight: { type: String, default: "Partial" },
//       water: { type: String, default: "Weekly" },
//       temp: { type: String, default: "18-30°C" },
//       tips: [{ type: String }]
//     },

//     potOptions: [
//       {
//         id: { type: String },
//         label: { type: String },
//         price: { type: Number, default: 0 }
//       }
//     ],

//     policies: {
//       shipping: { type: String },
//       returns: { type: String },
//       sustainability: { type: String }
//     }
//   },
//   { timestamps: true }
// );

// /* =====================================================
//    AUTO LOW STOCK NOTIFICATION HOOK
// ===================================================== */
// productSchema.post("save", async function (doc) {
//   try {
//     // LOW STOCK ALERT
//     if (doc.stock <= LOW_STOCK_THRESHOLD && !doc.lowStockNotified) {

//       const admins = await User.find({
//         role: { $in: ["admin", "super_admin"] }
//       }).select("_id");

//       const message =
//         doc.stock === 0
//           ? `${doc.name} is OUT OF STOCK`
//           : `${doc.name} is low in stock. Only ${doc.stock} left.`;

//       for (const admin of admins) {
//         await sendNotification({
//           user: admin._id,
//           title: "Low Stock Alert",
//           message,
//           type: "low_stock",
//           link: `/admin/products/${doc._id}`,
//         });
//       }

//       doc.lowStockNotified = true;
//       await doc.save();
//     }

//     // RESET FLAG WHEN RESTOCKED
//     if (doc.stock > LOW_STOCK_THRESHOLD && doc.lowStockNotified) {
//       doc.lowStockNotified = false;
//       await doc.save();
//     }

//   } catch (err) {
//     console.error("Low stock notification error:", err);
//   }
// });

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");
const sendNotification = require("../utils/sendNotification");
const { User } = require("./User");

const LOW_STOCK_THRESHOLD = 5;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

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

    // Images
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      min: 0,
    },

    // Stock
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Prevent duplicate notifications
    lowStockNotified: {
      type: Boolean,
      default: false,
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

    care: {
      level: {
        type: String,
        default: "Easy",
      },

      levelPercent: {
        type: Number,
        default: 33,
      },

      sunlight: {
        type: String,
        default: "Partial",
      },

      water: {
        type: String,
        default: "Weekly",
      },

      temp: {
        type: String,
        default: "18-30°C",
      },

      tips: [
        {
          type: String,
        },
      ],
    },

    potOptions: [
      {
        id: String,
        label: String,
        price: {
          type: Number,
          default: 0,
        },
      },
    ],

    policies: {
      shipping: String,
      returns: String,
      sustainability: String,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   LOW STOCK / OUT OF STOCK NOTIFICATIONS
===================================================== */

productSchema.post("save", async function (doc) {
  try {

    // LOW STOCK OR OUT OF STOCK
    if (
      doc.stock <= LOW_STOCK_THRESHOLD &&
      !doc.lowStockNotified
    ) {

      const admins = await User.find({
        role: { $in: ["admin", "super_admin"] }
      }).select("_id");

      const message =
        doc.stock === 0
          ? `${doc.name} is OUT OF STOCK`
          : `${doc.name} is running low. Only ${doc.stock} items left`;

      for (const admin of admins) {
        await sendNotification({
          user: admin._id,
          title: "Low Stock Alert",
          message,
          type: "low_stock",
          link: `/admin/products/${doc._id}`,
        });
      }

      // Update directly without triggering save middleware again
      await mongoose.model("Product").updateOne(
        { _id: doc._id },
        {
          $set: {
            lowStockNotified: true
          }
        }
      );

      console.log(
        `✅ Low stock notification sent for ${doc.name}`
      );
    }

    // RESET WHEN RESTOCKED
    if (
      doc.stock > LOW_STOCK_THRESHOLD &&
      doc.lowStockNotified
    ) {

      await mongoose.model("Product").updateOne(
        { _id: doc._id },
        {
          $set: {
            lowStockNotified: false
          }
        }
      );

      console.log(
        `✅ Notification flag reset for ${doc.name}`
      );
    }

  } catch (err) {
    console.error(
      "❌ Low stock notification error:",
      err
    );
  }
});

module.exports = mongoose.model(
  "Product",
  productSchema
);