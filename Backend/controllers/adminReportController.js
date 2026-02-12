// // file: controllers/adminReportController.js
// const Review = require("../models/Review");
// const mongoose = require("mongoose");
// const Product = require("../models/Product");

// /* ======================================================
//         GET ALL REVIEWS THAT HAVE BEEN REPORTED
//         (returns a front-end friendly summary array)
// ====================================================== */
// exports.getReportedReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find({
//       reports: { $exists: true, $not: { $size: 0 } },
//     })
//       .populate("user", "username _id")
//       .populate("product", "name image1 price category stock")
//       .sort({ createdAt: -1 });

//     // map to compact shape expected by frontend
//     const payload = reviews.map((r) => ({
//       _id: r._id,
//       productId: r.product?._id || null,
//       productName: r.product?.name || "Unknown product",
//       productImage: r.product?.image1 || null,
//       productPrice: r.product?.price ?? null,
//       productCategory: r.product?.category || "",
//       userId: r.user?._id || null,
//       userName: r.user?.username || "Unknown user",
//       rating: r.rating,
//       comment: r.comment,
//       reportCount: (r.reports || []).length,
//       createdAt: r.createdAt,
//     }));

//     res.json(payload);
//   } catch (err) {
//     console.error("Get reported reviews error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ======================================================
//         GET ALL REPORT DETAILS FOR ONE REVIEW
//         (detailed: review + list of reports with reporter info)
// ====================================================== */
// exports.getReviewReports = async (req, res) => {
//   try {
//     const { reviewId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(reviewId)) {
//       return res.status(400).json({ message: "Invalid review ID" });
//     }

//     const review = await Review.findById(reviewId)
//       .populate("user", "username _id")
//       .populate("product", "name image1 image2 image3 price category stock care")
//       .populate("reports.user", "username _id");

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     const reports = (review.reports || []).map((r) => ({
//       reportedById: r.user?._id || null,
//       reportedBy: r.user?.username || "Unknown",
//       reason: r.reason || "",
//       reportedAt: r.reportedAt,
//     }));

//     res.json({
//       reviewId: review._id,
//       rating: review.rating,
//       comment: review.comment,
//       createdAt: review.createdAt,
//       reviewAuthor: {
//         id: review.user?._id || null,
//         username: review.user?.username || "Unknown",
//       },
//       product: review.product
//         ? {
//             id: review.product._id,
//             name: review.product.name,
//             image1: review.product.image1,
//             image2: review.product.image2,
//             image3: review.product.image3,
//             price: review.product.price,
//             category: review.product.category,
//             stock: review.product.stock,
//             care: review.product.care || {},
//           }
//         : null,
//       reports,
//     });
//   } catch (err) {
//     console.error("Get review reports error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* ======================================================
//         GET PRODUCT DETAILS FOR A REVIEW (explicit)
//         useful when the admin wants full product info
// ====================================================== */
// exports.getReviewProduct = async (req, res) => {
//   try {
//     const { reviewId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(reviewId)) {
//       return res.status(400).json({ message: "Invalid review ID" });
//     }

//     const review = await Review.findById(reviewId).populate(
//       "product",
//       "-__v" // populate full product except mongoose __v
//     );

//     if (!review) return res.status(404).json({ message: "Review not found" });

//     if (!review.product)
//       return res.status(404).json({ message: "Product not found" });

//     res.json(review.product);
//   } catch (err) {
//     console.error("Get review product error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// file: controllers/adminReportController.js
const Review = require("../models/Review");
const mongoose = require("mongoose");
const Product = require("../models/Product");

/* ======================================================
        GET ALL REVIEWS THAT HAVE BEEN REPORTED
        (returns a front-end friendly summary array)
====================================================== */
exports.getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      reports: { $exists: true, $not: { $size: 0 } },
    })
      .populate("user", "username _id")
      .populate("product", "name image1 price category stock")
      .sort({ createdAt: -1 });

    // map to compact shape expected by frontend
    const payload = reviews.map((r) => ({
      _id: r._id,
      productId: r.product?._id || null,
      productName: r.product?.name || "Unknown product",
      productImage: r.product?.image1 || null,
      productPrice: r.product?.price ?? null,
      productCategory: r.product?.category || "",
      userId: r.user?._id || null,
      userName: r.user?.username || "Unknown user",
      rating: r.rating,
      comment: r.comment,
      reportCount: (r.reports || []).length,
      createdAt: r.createdAt,
    }));

    res.json(payload);
  } catch (err) {
    console.error("Get reported reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
        GET ALL REPORT DETAILS FOR ONE REVIEW
        (detailed: review + list of reports with reporter info)
====================================================== */
exports.getReviewReports = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId)
      .populate("user", "username _id")
      .populate("product", "name image1 image2 image3 price category stock care")
      .populate("reports.user", "username _id");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const reports = (review.reports || []).map((r) => ({
      reportedById: r.user?._id || null,
      reportedBy: r.user?.username || "Unknown",
      reason: r.reason || "",
      reportedAt: r.reportedAt,
    }));

    res.json({
      reviewId: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      reviewAuthor: {
        id: review.user?._id || null,
        username: review.user?.username || "Unknown",
      },
      product: review.product
        ? {
            id: review.product._id,
            name: review.product.name,
            image1: review.product.image1,
            image2: review.product.image2,
            image3: review.product.image3,
            price: review.product.price,
            category: review.product.category,
            stock: review.product.stock,
            care: review.product.care || {},
          }
        : null,
      reports,
    });
  } catch (err) {
    console.error("Get review reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
        GET PRODUCT DETAILS FOR A REVIEW (explicit)
====================================================== */
exports.getReviewProduct = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId).populate(
      "product",
      "-__v"
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (!review.product)
      return res.status(404).json({ message: "Product not found" });

    res.json(review.product);
  } catch (err) {
    console.error("Get review product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const product = await Product.findById(productId);

    if (product) {
      product.averageRating = stats[0]?.averageRating || 0;
      product.reviewCount = stats[0]?.reviewCount || 0;
      await product.save();
    }

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
