import { useEffect, useState } from "react";
import { Star, Flag, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getReviewsByProduct,
  createReview,
  reportReview,
} from "../../services/publicAPI";
import toast from "react-hot-toast";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

/* ── Reusable star row ── */
const Stars = ({ value, size = 13, interactive = false, onChange }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        onClick={() => interactive && onChange?.(star)}
        className={`transition-colors duration-150 ${
          interactive ? "cursor-pointer" : ""
        } ${
          star <= value
            ? "text-[#c4704a] fill-[#c4704a]"
            : "text-[#2d4a2d]/20"
        }`}
      />
    ))}
  </div>
);

/* ── Avatar initials ── */
const Avatar = ({ name }) => (
  <div
    className="w-8 h-8 rounded-full bg-[#2d4a2d] text-[#f7f4ee] flex items-center justify-center text-sm font-semibold flex-shrink-0"
    style={serif}
  >
    {(name || "U")[0].toUpperCase()}
  </div>
);

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews]       = useState([]);
  const [average, setAverage]       = useState(0);
  const [count, setCount]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(0);

  const [reportingId, setReportingId]     = useState(null);
  const [reportReason, setReportReason]   = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  /* ── Fetch ── */
  const fetchReviews = async (p = 1) => {
    try {
      const data = await getReviewsByProduct(productId, p);
      setReviews(data.reviews || []);
      setAverage(data.averageRating || 0);
      setCount(data.reviewCount || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) { console.error("Fetch reviews error:", err); }
  };

  useEffect(() => { if (productId) fetchReviews(page); }, [productId, page]);

  /* ── Submit review ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Comment cannot be empty");
    try {
      setLoading(true);
      await createReview({ productId, rating, comment });
      setComment(""); setRating(5); setPage(1);
      fetchReviews(1);
    } catch (err) { toast.error(err.message || "Failed to submit review"); }
    finally { setLoading(false); }
  };

  /* ── Report ── */
  const handleReportSubmit = async (reviewId) => {
    if (!reportReason.trim()) return toast.error("Please enter a reason");
    try {
      setReportLoading(true);
      await reportReview(reviewId, { reason: reportReason });
      setReportingId(null); setReportReason("");
    } catch (err) { toast.error(err.message || "Failed to report review"); }
    finally { setReportLoading(false); }
  };

  /* ── Rating distribution (visual only) ── */
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <section className="px-6 lg:px-14 py-16 max-w-[1440px] mx-auto">

      {/* ── Section heading ── */}
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#2d4a2d]/10">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-2" style={sans}>
            — Community
          </p>
          <h2
            className="font-light text-[#1a3320] m-0 leading-tight"
            style={{ ...serif, fontSize: "clamp(28px, 3.5vw, 40px)" }}
          >
            Customer Reviews
          </h2>
        </div>
        <span className="text-[13px] font-light text-[#8c8880]" style={sans}>
          {count} {count === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">

        {/* ══ LEFT — reviews list ══ */}
        <div className="flex flex-col gap-1">

          {/* Average + distribution */}
          <div className="flex items-start gap-10 mb-10 p-6 bg-[#f7f4ee] border border-[#2d4a2d]/10 rounded-sm">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span
                className="font-light text-[#1a3320] leading-none"
                style={{ ...serif, fontSize: "56px" }}
              >
                {average ? average.toFixed(1) : "0.0"}
              </span>
              <Stars value={Math.round(average)} size={14} />
              <span className="text-[11px] text-[#8c8880] mt-1" style={sans}>
                out of 5
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-2 justify-center">
              {distribution.map(({ star, count: c }) => (
                <div key={star} className="flex items-center gap-2.5">
                  <span className="text-[11px] text-[#8c8880] w-3 text-right flex-shrink-0" style={sans}>
                    {star}
                  </span>
                  <Star size={10} className="text-[#c4704a] fill-[#c4704a] flex-shrink-0" />
                  <div className="flex-1 h-1 bg-[#2d4a2d]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c4704a] rounded-full transition-all duration-500"
                      style={{ width: count ? `${(c / count) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-[11px] text-[#8c8880] w-4 flex-shrink-0" style={sans}>
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          {reviews.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-[#2d4a2d]/15 rounded-sm">
              <p className="text-[13px] font-light text-[#8c8880]" style={sans}>
                No reviews yet — be the first to share your experience.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#2d4a2d]/10">
              {reviews.map((review) => (
                <div key={review._id} className="py-6 first:pt-0">
                  <div className="flex items-start gap-3">
                    <Avatar name={review.user?.username} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[13.5px] font-medium text-[#1a3320]" style={sans}>
                          {review.user?.username || "Anonymous"}
                        </span>
                        <span className="text-[11px] font-light text-[#8c8880]" style={sans}>
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="mb-3">
                        <Stars value={review.rating} size={12} />
                      </div>

                      <p className="text-[13.5px] font-light text-[#4a4a4a] leading-relaxed m-0" style={sans}>
                        {review.comment}
                      </p>

                      {/* Report toggle */}
                      <button
                        onClick={() =>
                          setReportingId(reportingId === review._id ? null : review._id)
                        }
                        className="mt-3 flex items-center gap-1 text-[11px] text-[#8c8880] bg-transparent border-none cursor-pointer p-0 hover:text-[#c4704a] transition-colors"
                        style={sans}
                      >
                        <Flag size={11} /> Report
                      </button>

                      {/* Report form */}
                      {reportingId === review._id && (
                        <div className="mt-4 bg-[#f7f4ee] border border-[#c4704a]/20 rounded-sm p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] tracking-[0.1em] uppercase text-[#c4704a] m-0" style={sans}>
                              Report this review
                            </p>
                            <button
                              onClick={() => { setReportingId(null); setReportReason(""); }}
                              className="text-[#8c8880] bg-transparent border-none cursor-pointer p-0 hover:text-[#2c2c2c] transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Describe the issue…"
                            rows={2}
                            className="w-full bg-transparent border border-[#2d4a2d]/20 rounded-sm px-3 py-2.5 text-[13px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] resize-none transition-colors"
                            style={sans}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReportSubmit(review._id)}
                              disabled={reportLoading}
                              className="px-4 py-2 bg-[#c4704a] text-[#fdfcf8] text-[11px] font-medium tracking-[0.1em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#b5603a] transition-colors disabled:opacity-50"
                              style={sans}
                            >
                              {reportLoading ? "Sending…" : "Submit"}
                            </button>
                            <button
                              onClick={() => { setReportingId(null); setReportReason(""); }}
                              className="px-4 py-2 bg-transparent border border-[#2d4a2d]/20 text-[11px] font-medium tracking-[0.1em] uppercase text-[#2c2c2c] cursor-pointer rounded-sm hover:border-[#2d4a2d]/40 transition-colors"
                              style={sans}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-[#2d4a2d]/10">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#2d4a2d]/20 text-[12px] text-[#2c2c2c] rounded-sm hover:border-[#2d4a2d] hover:text-[#2d4a2d] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={sans}
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <span className="text-[12px] font-light text-[#8c8880]" style={sans}>
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#2d4a2d]/20 text-[12px] text-[#2c2c2c] rounded-sm hover:border-[#2d4a2d] hover:text-[#2d4a2d] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={sans}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* ══ RIGHT — Write a review ══ */}
        <aside className="lg:sticky lg:top-28">
          <div className="border border-[#2d4a2d]/12 bg-[#f7f4ee] rounded-sm p-6">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] m-0 mb-2" style={sans}>
              ✦ Share your thoughts
            </p>
            <h3
              className="font-light text-[#1a3320] m-0 mb-6 leading-tight"
              style={{ ...serif, fontSize: "26px" }}
            >
              Write a Review
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Interactive star picker */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Your Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer transition-all duration-100 ${
                        star <= (hovered || rating)
                          ? "text-[#c4704a] fill-[#c4704a] scale-110"
                          : "text-[#2d4a2d]/20"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-[12px] text-[#8c8880] font-light" style={sans}>
                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][hovered || rating]}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[0.1em] uppercase text-[#8c8880]" style={sans}>
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about your experience with this plant…"
                  rows={5}
                  className="w-full bg-transparent border border-[#2d4a2d]/20 rounded-sm px-4 py-3 text-[13.5px] text-[#2c2c2c] placeholder-[#c8c4bc] outline-none focus:border-[#2d4a2d] resize-none transition-colors leading-relaxed"
                  style={sans}
                />
                <p className="text-[11px] text-right text-[#8c8880] font-light m-0" style={sans}>
                  {comment.length} characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1a3320] text-[#f7f4ee] text-[12px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#2d4a2d] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                style={sans}
              >
                {loading ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </div>
        </aside>

      </div>
    </section>
  );
};

export default ProductReviews;