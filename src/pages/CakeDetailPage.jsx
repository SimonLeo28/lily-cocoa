import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaBolt,
  FaClock, FaLeaf, FaCheckCircle,
} from "react-icons/fa";
import { getCakeByIdApi } from "../api/cakeApi.js";
import { getCakeReviewsApi, createReviewApi } from "../api/reviewApi.js";
import { addToWishlistApi, removeFromWishlistApi, getWishlistApi } from "../api/wishlistApi.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/common/Loader.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const resolveImg = (img) =>
  img
    ? img.startsWith("http") ? img : `${API_BASE}${img}`
    : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80";

const CakeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();

  const [cake, setCake] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [weight, setWeight] = useState("");
  const [flavour, setFlavour] = useState("");
  const [messageOnCake, setMessageOnCake] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await getCakeByIdApi(id);
      const c = data.cake;
      setCake(c);
      const basePrice = Math.round(c.basePrice - (c.basePrice * (c.discountPercent || 0)) / 100);
      setPrice(basePrice);
      if (c.weightOptions?.length) {
        setWeight(c.weightOptions[0].weight);
        setPrice(c.weightOptions[0].price);
      }
      if (c.flavours?.length) setFlavour(c.flavours[0]);

      const rev = await getCakeReviewsApi(id);
      setReviews(rev.data.reviews);

      if (isAuthenticated) {
        const wl = await getWishlistApi();
        setIsWishlisted(wl.data.wishlist.some((w) => w._id === id));
      }
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [id, isAuthenticated]);

  const handleWeightChange = (opt) => {
    setWeight(opt.weight);
    setPrice(opt.price);
  };

  const handleAddToCart = async (redirect = false) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addItem({ cakeId: id, weight, flavour, eggType: cake.eggType, messageOnCake, specialInstructions, quantity });
      if (redirect) navigate("/cart");
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (isWishlisted) {
      await removeFromWishlistApi(id);
      setIsWishlisted(false);
    } else {
      await addToWishlistApi(id);
      setIsWishlisted(true);
    }
  };

  const submitReview = async () => {
    if (!reviewText.trim()) { toast.error("Please write a review"); return; }
    setSubmittingReview(true);
    try {
      await createReviewApi({ cakeId: id, rating: reviewRating, comment: reviewText });
      const rev = await getCakeReviewsApi(id);
      setReviews(rev.data.reviews);
      setReviewText(""); setReviewRating(5);
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!cake) return <div className="text-center py-20">Cake not found</div>;

  const images = cake.images?.length ? cake.images : [""];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* ---- Images ---- */}
        <div>
          <div className="relative rounded-3xl overflow-hidden h-96 shadow-soft">
            <img src={resolveImg(images[activeImg])} alt={cake.name} className="w-full h-full object-cover" />
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-rose hover:scale-110 transition-transform"
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    activeImg === i ? "border-rose" : "border-transparent"
                  }`}
                >
                  <img src={resolveImg(img)} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Info ---- */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-rose/20 text-rose font-semibold px-3 py-1 rounded-full capitalize">
              {cake.eggType}
            </span>
            {cake.isBestSeller && (
              <span className="text-xs bg-caramel/20 text-caramel font-semibold px-3 py-1 rounded-full">
                Best Seller
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl font-bold text-chocolate mb-3">{cake.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-caramel">{Array(Math.round(cake.rating || 0)).fill(0).map((_, i) => <FaStar key={i} />)}</div>
            <span className="text-sm text-chocolate/60">({cake.numReviews} reviews)</span>
          </div>

          <p className="text-chocolate/65 text-sm leading-relaxed mb-5">{cake.description}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-rose">₹{price}</span>
            {cake.discountPercent > 0 && (
              <>
                <span className="text-chocolate/40 line-through text-lg">₹{cake.basePrice}</span>
                <span className="text-sage font-semibold text-sm">{cake.discountPercent}% OFF</span>
              </>
            )}
          </div>

          {/* Weight Selection */}
          {cake.weightOptions?.length > 0 && (
            <div className="mb-5">
              <p className="font-semibold text-chocolate mb-2 text-sm">Select Weight</p>
              <div className="flex gap-2 flex-wrap">
                {cake.weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    onClick={() => handleWeightChange(opt)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      weight === opt.weight
                        ? "border-rose bg-rose/10 text-rose"
                        : "border-blush text-chocolate hover:border-rose"
                    }`}
                  >
                    {opt.weight} — ₹{opt.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavour Selection */}
          {cake.flavours?.length > 0 && (
            <div className="mb-5">
              <p className="font-semibold text-chocolate mb-2 text-sm">Select Flavour</p>
              <div className="flex gap-2 flex-wrap">
                {cake.flavours.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavour(f)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      flavour === f
                        ? "border-rose bg-rose/10 text-rose"
                        : "border-blush text-chocolate hover:border-rose"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message on Cake */}
          <div className="mb-4">
            <label className="block font-semibold text-chocolate mb-1 text-sm">Message on Cake (optional)</label>
            <input
              type="text"
              maxLength={50}
              value={messageOnCake}
              onChange={(e) => setMessageOnCake(e.target.value)}
              placeholder="e.g. Happy Birthday Priya!"
              className="w-full px-4 py-3 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm"
            />
          </div>

          {/* Special Instructions */}
          <div className="mb-5">
            <label className="block font-semibold text-chocolate mb-1 text-sm">Special Instructions (optional)</label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any specific requests?"
              className="w-full px-4 py-3 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm resize-none"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-semibold text-chocolate text-sm">Quantity</p>
            <div className="flex items-center gap-3 bg-blush/40 rounded-xl px-3 py-1">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 text-rose font-bold text-lg">−</button>
              <span className="font-semibold text-chocolate w-5 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 text-rose font-bold text-lg">+</button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleAddToCart(false)}
              disabled={adding}
              className="flex items-center gap-2 btn-secondary flex-1 justify-center disabled:opacity-60"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => handleAddToCart(true)}
              disabled={adding}
              className="flex items-center gap-2 btn-primary flex-1 justify-center disabled:opacity-60"
            >
              <FaBolt /> Buy Now
            </button>
          </div>

          {/* Meta info */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-blush/30 rounded-2xl p-3">
              <FaClock className="text-rose mx-auto mb-1" />
              <span className="text-chocolate/70">{cake.preparationTimeHours}h prep</span>
            </div>
            <div className="bg-blush/30 rounded-2xl p-3">
              <FaLeaf className="text-sage mx-auto mb-1" />
              <span className="text-chocolate/70 capitalize">{cake.eggType}</span>
            </div>
            <div className="bg-blush/30 rounded-2xl p-3">
              <FaCheckCircle className="text-caramel mx-auto mb-1" />
              <span className="text-chocolate/70">Fresh Baked</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Ingredients ---- */}
      {cake.ingredients && (
        <div className="mt-12 bg-white rounded-3xl p-6 shadow-soft">
          <h3 className="font-display text-2xl font-bold text-chocolate mb-3">Ingredients</h3>
          <p className="text-chocolate/65 text-sm leading-relaxed">{cake.ingredients}</p>
        </div>
      )}

      {/* ---- Reviews ---- */}
      <div className="mt-12">
        <h3 className="font-display text-2xl font-bold text-chocolate mb-6">Customer Reviews ({reviews.length})</h3>

        {isAuthenticated && (
          <div className="bg-white rounded-3xl p-6 shadow-soft mb-6">
            <h4 className="font-semibold text-chocolate mb-3">Write a Review</h4>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} onClick={() => setReviewRating(r)}>
                  <FaStar className={r <= reviewRating ? "text-caramel" : "text-blush"} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience…"
              className="w-full px-4 py-3 rounded-xl border border-blush outline-none focus:border-rose text-sm resize-none mb-3"
            />
            <button onClick={submitReview} disabled={submittingReview} className="btn-primary !px-6 !py-2 text-sm">
              {submittingReview ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-chocolate/50 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl p-5 shadow-soft flex gap-4">
                <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {r.user?.firstName?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-chocolate text-sm">{r.user?.firstName} {r.user?.lastName}</p>
                    <div className="flex text-caramel text-xs">{Array(r.rating).fill(0).map((_, i) => <FaStar key={i} />)}</div>
                  </div>
                  <p className="text-chocolate/65 text-sm mt-1">{r.comment}</p>
                  <p className="text-xs text-chocolate/40 mt-1">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CakeDetailPage;
