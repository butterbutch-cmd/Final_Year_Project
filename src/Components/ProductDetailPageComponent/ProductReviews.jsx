import { useEffect, useState } from "react";
import {
  getReviewsByProduct,
  createReview,
  reportReview, // <-- will add in publicAPI next
} from "../../services/publicAPI";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Report state
  const [reportingId, setReportingId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  /* ================= FETCH REVIEWS ================= */
  const fetchReviews = async (currentPage = 1) => {
    try {
      const data = await getReviewsByProduct(productId, currentPage);

      setReviews(data.reviews || []);
      setAverage(data.averageRating || 0);
      setCount(data.reviewCount || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(page);
    }
  }, [productId, page]);

  /* ================= SUBMIT REVIEW ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return alert("Comment cannot be empty");
    }

    try {
      setLoading(true);

      await createReview({
        productId,
        rating,
        comment,
      });

      setComment("");
      setRating(5);
      setPage(1);
      fetchReviews(1);
    } catch (err) {
      alert(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REPORT REVIEW ================= */
  const handleReportSubmit = async (reviewId) => {
    if (!reportReason.trim()) {
      return alert("Please enter a reason");
    }

    try {
      setReportLoading(true);

      await reportReview(reviewId, {
        reason: reportReason,
      });

      alert("Review reported successfully");

      setReportingId(null);
      setReportReason("");
    } catch (err) {
      alert(err.message || "Failed to report review");
    } finally {
      setReportLoading(false);
    }
  };

  /* ================= STAR RENDER ================= */
  const renderStars = (value) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= value ? "⭐" : "☆"}</span>
      ))}
    </div>
  );

  return (
    <div className="mt-16 border-t pt-12 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">
        Customer Reviews ({count})
      </h2>

      {/* Average */}
      <div className="flex items-center gap-4 mb-8">
        <div className="text-3xl font-bold">
          {average ? average.toFixed(1) : "0.0"}
        </div>
        {renderStars(Math.round(average))}
      </div>

      {/* Submit */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <h3 className="text-lg font-semibold">Write a Review</h3>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full border p-3 rounded resize-none"
          rows={4}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {reviews.map((review) => (
          <div key={review._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">
                {review.user?.username || "User"}
              </div>
              {renderStars(review.rating)}
            </div>

            <p className="text-gray-700">{review.comment}</p>

            <div className="text-xs text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>

            {/* Report Button */}
            <div className="mt-3">
              <button
                onClick={() =>
                  setReportingId(
                    reportingId === review._id ? null : review._id
                  )
                }
                className="text-sm text-red-600 hover:underline"
              >
                Report
              </button>
            </div>

            {/* Report UI */}
            {reportingId === review._id && (
              <div className="mt-3 border-t pt-3 space-y-2">
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for reporting..."
                  className="w-full border p-2 rounded resize-none"
                  rows={2}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReportSubmit(review._id)}
                    disabled={reportLoading}
                    className="bg-red-600 text-white px-4 py-1 rounded text-sm disabled:opacity-50"
                  >
                    {reportLoading ? "Reporting..." : "Submit Report"}
                  </button>

                  <button
                    onClick={() => {
                      setReportingId(null);
                      setReportReason("");
                    }}
                    className="px-4 py-1 border rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
