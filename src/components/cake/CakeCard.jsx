import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const resolveImage = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80";
  return img.startsWith("http") ? img : `${API_BASE}${img}`;
};

const CakeCard = ({ cake, onToggleWishlist, isWishlisted }) => {
  const { isAuthenticated } = useAuth();
  const finalPrice = Math.round(cake.basePrice - (cake.basePrice * (cake.discountPercent || 0)) / 100);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card group relative"
    >
      {isAuthenticated && (
        <button
          onClick={() => onToggleWishlist?.(cake._id)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-rose hover:scale-110 transition-transform"
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}

      <Link to={`/cakes/${cake._id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={resolveImage(cake.images?.[0])}
            alt={cake.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          {cake.isBestSeller && (
            <span className="inline-block text-xs bg-caramel/20 text-caramel font-semibold px-2 py-1 rounded-full mb-2">
              Best Seller
            </span>
          )}
          <h3 className="font-display font-semibold text-lg text-chocolate truncate">{cake.name}</h3>
          <div className="flex items-center gap-1 text-sm text-caramel mt-1">
            <FaStar /> <span>{cake.rating?.toFixed?.(1) || cake.rating || "New"}</span>
            <span className="text-chocolate/50">({cake.numReviews || 0})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-rose text-lg">₹{finalPrice}</span>
            {cake.discountPercent > 0 && (
              <span className="text-sm text-chocolate/40 line-through">₹{cake.basePrice}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CakeCard;
