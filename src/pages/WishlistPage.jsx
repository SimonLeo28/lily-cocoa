import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlistApi, removeFromWishlistApi } from "../api/wishlistApi.js";
import CakeCard from "../components/cake/CakeCard.jsx";
import Loader from "../components/common/Loader.jsx";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlistApi()
      .then(({ data }) => { setWishlist(data.wishlist); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRemove = async (cakeId) => {
    await removeFromWishlistApi(cakeId);
    setWishlist((prev) => prev.filter((c) => c._id !== cakeId));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-chocolate mb-8">My Wishlist ❤️</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">💔</div>
          <h3 className="font-display text-2xl text-chocolate mb-2">Your wishlist is empty</h3>
          <p className="text-chocolate/60 mb-8">Heart cakes you love to save them here.</p>
          <Link to="/cakes" className="btn-primary">Browse Cakes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((cake) => (
            <CakeCard
              key={cake._id}
              cake={cake}
              isWishlisted={true}
              onToggleWishlist={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
