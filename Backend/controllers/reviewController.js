const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");

/* ================= GET REVIEWS BY PRODUCT ================= */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      product: productId,
    });

    const totalPages = Math.ceil(totalReviews / limit);

    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRating = stats[0]?.averageRating || 0;

    res.json({
      reviews,
      averageRating,
      reviewCount: totalReviews,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE REVIEW ================= */
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    product.averageRating = stats[0]?.averageRating || 0;
    product.reviewCount = stats[0]?.reviewCount || 0;

    await product.save();

    res.status(201).json({
      message: "Review submitted successfully",
    });
  } catch (err) {
    console.error("Create review error:", err);

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REPORT REVIEW ================= */
exports.reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    if (!reason) {
      return res.status(400).json({ message: "Report reason is required" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // 🚫 Prevent user from reporting their own review
    if (review.user.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot report your own review" });
    }

    // 🚫 Prevent duplicate report by same user
    const alreadyReported = review.reports.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReported) {
      return res
        .status(400)
        .json({ message: "You have already reported this review" });
    }

    review.reports.push({
      user: userId,
      reason,
    });

    await review.save();

    res.status(200).json({
      message: "Review reported successfully",
    });
  } catch (err) {
    console.error("Report review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

