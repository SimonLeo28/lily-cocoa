import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaMinus, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { getCakeByIdApi } from "../api/cakeApi.js";
import { getCakeReviewsApi, createReviewApi } from "../api/reviewApi.js";
import Loader from "../components/common/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const resolveImage = (img) => (img ? (img.startsWith("http") ? img : `${API_BASE}${img}`) : "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80");

const CakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [weight, setWeight] = useState("");
  const [flavour, setFlavour] = useState("");
  const [eggType, setEggType] = useState("");
  const [message, setMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getCakeByIdApi(id);
        setCake(data.cake);
        setWeight(data.cake.weightOptions?.[0]?.weight || "");
        setFlavour(data.cake.flavours?.[0] || "");
        setEggType(data.cake.eggType);

        const reviewsRes = await getCakeReviewsApi(id);
        setReviews(reviewsRes.data.reviews);
      } catch (err) {
        toast.error("Cake not found");
        navigate("/cakes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !cake) return <Loader fullScreen />;

  const currentPrice =
    cake.weightOptions?.find((w) => w.weight === weight)?.price ?? cake.finalPrice ?? cake.basePrice;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    await addItem({
      cakeId: cake._id,
      weight,
      flavour,
      eggType,
      messageOnCake: message,
      specialInstructions: instructions,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }
    try {
      await createReviewApi({ cakeId: cake._id, ...reviewForm });
      toast.success("Review submitted!");
      const reviewsRes = await getCakeReviewsApi(id);
      setReviews(reviewsRes.data.reviews);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={resolveImage(cake.images?.[activeImage])}
            alt={cake.name}
            className="w-full h-96 object-cover rounded-3xl shadow-soft"
          />
          {cake.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {cake.images.map((img, idx) => (
                <img
                  key={idx}
                  src={resolveImage(img)}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                    activeImage === idx ? "border-rose" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{cake.name}</h1>
          <div className="flex items-center gap-2 text-caramel mb-4">
            <FaStar /> <span>{cake.rating || "New"}</span>
            <span className="text-chocolate/50 text-sm">({cake.numReviews} reviews)</span>
          </div>
          <p className="text-chocolate/70 mb-4">{cake.description}</p>
          {cake.ingredients && (
            <p className="text-sm text-chocolate/60 mb-4">
              <span className="font-medium">Ingredients:</span> {cake.ingredients}
            </p>
          )}

          <div className="text-3xl font-bold text-rose mb-6">₹{totalPrice}</div>

          {cake.weightOptions?.length > 0 && (
            <div className="mb-4">
              <p className="font-medium mb-2">Select Weight</p>
              <div className="flex flex-wrap gap-2">
                {cake.weightOptions.map((w) => (
                  <button
                    key={w.weight}
                    onClick={() => setWeight(w.weight)}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      weight === w.weight ? "bg-rose text-white border-rose" : "border-blush"
                    }`}
                  >
                    {w.weight} - ₹{w.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cake.flavours?.length > 0 && (
            <div className="mb-4">
              <p className="font-medium mb-2">Select Flavour</p>
              <div className="flex flex-wrap gap-2">
                {cake.flavours.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavour(f)}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      flavour === f ? "bg-rose text-white border-rose" : "border-blush"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <p className="font-medium mb-2">Egg Type</p>
            <div className="flex gap-2">
              {["egg", "eggless"].map((t) => (
                <button
                  key={t}
                  onClick={() => setEggType(t)}
                  className={`px-4 py-2 rounded-full border text-sm capitalize ${
                    eggType === t ? "bg-rose text-white border-rose" : "border-blush"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="font-medium block mb-2">Message on Cake</label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Happy Birthday Sara!"
              className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose"
              maxLength={40}
            />
          </div>

          <div className="mb-6">
            <label className="font-medium block mb-2">Special Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special requests..."
              className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <p className="font-medium">Quantity</p>
            <div className="flex items-center gap-3 border border-blush rounded-full px-3 py-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <FaMinus size={12} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <FaPlus size={12} />
              </button>
            </div>
          </div>

          {!cake.isAvailable && (
            <p className="text-red-500 font-medium mb-4">Currently unavailable</p>
          )}

          <div className="flex gap-4">
            <button onClick={handleAddToCart} disabled={!cake.isAvailable} className="btn-secondary flex-1">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={!cake.isAvailable} className="btn-primary flex-1">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <form onSubmit={submitReview} className="card p-6 mb-8 max-w-xl">
          <p className="font-medium mb-2">Write a Review</p>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar
                key={n}
                onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                className={`cursor-pointer ${n <= reviewForm.rating ? "text-caramel" : "text-blush"}`}
              />
            ))}
          </div>
          <textarea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            placeholder="Share your experience..."
            required
            className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none mb-3"
            rows={3}
          />
          <button className="btn-primary">Submit Review</button>
        </form>

        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-chocolate/60">No reviews yet. Be the first!</p>}
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{r.user?.firstName} {r.user?.lastName}</p>
                <div className="flex text-caramel text-sm">
                  {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} />)}
                </div>
              </div>
              <p className="text-chocolate/70 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CakeDetail;
