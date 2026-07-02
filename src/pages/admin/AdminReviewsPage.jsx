import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar, FaTrash } from "react-icons/fa";
import { getAllReviewsApi, deleteReviewApi } from "../../api/reviewApi.js";
import Loader from "../../components/common/Loader.jsx";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await getAllReviewsApi();
    setReviews(data.reviews);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReviewApi(id);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-chocolate mb-6">Reviews</h1>

      {loading ? <Loader /> : reviews.length === 0 ? (
        <div className="text-center py-16 text-chocolate/50">No reviews yet</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl shadow-soft p-5 flex justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="font-semibold text-chocolate">
                    {r.user?.firstName} {r.user?.lastName}
                  </span>
                  <span className="text-xs text-chocolate/50">{r.user?.email}</span>
                  <div className="flex text-caramel text-sm">
                    {Array(r.rating).fill(0).map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
                <p className="text-xs text-rose mb-1">🎂 {r.cake?.name}</p>
                <p className="text-sm text-chocolate/70">{r.comment}</p>
                <p className="text-xs text-chocolate/40 mt-1">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <button onClick={() => handleDelete(r._id)} className="text-chocolate/30 hover:text-red-500 flex-shrink-0 self-start">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
