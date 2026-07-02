import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getWishlistApi, removeFromWishlistApi } from "../api/wishlistApi.js";
import CakeCard from "../components/cake/CakeCard.jsx";
import Loader from "../components/common/Loader.jsx";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getWishlistApi()
      .then((res) => setWishlist(res.data.wishlist))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleWishlist = async (cakeId) => {
    await removeFromWishlistApi(cakeId);
    toast.success("Removed from wishlist");
    load();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-chocolate/60 mb-6">Your wishlist is empty.</p>
          <Link to="/cakes" className="btn-primary">Browse Cakes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((cake) => (
            <CakeCard key={cake._id} cake={cake} isWishlisted onToggleWishlist={toggleWishlist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
