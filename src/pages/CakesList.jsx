import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getCakesApi } from "../api/cakeApi.js";
import { getCategoriesApi } from "../api/categoryApi.js";
import CakeCard from "../components/cake/CakeCard.jsx";
import CakeCardSkeleton from "../components/cake/CakeCardSkeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from "../api/wishlistApi.js";

const CakesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { isAuthenticated } = useAuth();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const eggType = searchParams.get("eggType") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    getCategoriesApi().then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getWishlistApi().then((res) => setWishlistIds(res.data.wishlist.map((w) => w._id)));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getCakesApi({ search, category, eggType, sort, page, limit: 12 });
        setCakes(data.cakes);
        setPages(data.pages);
      } catch (err) {
        toast.error("Failed to load cakes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category, eggType, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  const toggleWishlist = async (cakeId) => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      if (wishlistIds.includes(cakeId)) {
        await removeFromWishlistApi(cakeId);
        setWishlistIds(wishlistIds.filter((id) => id !== cakeId));
      } else {
        await addToWishlistApi(cakeId);
        setWishlistIds([...wishlistIds, cakeId]);
      }
    } catch (err) {
      toast.error("Could not update wishlist");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Cakes</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search cakes..."
          defaultValue={search}
          onKeyDown={(e) => e.key === "Enter" && updateParam("search", e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose"
        />
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="px-4 py-3 rounded-xl border border-blush focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={eggType}
          onChange={(e) => updateParam("eggType", e.target.value)}
          className="px-4 py-3 rounded-xl border border-blush focus:outline-none"
        >
          <option value="">Egg & Eggless</option>
          <option value="egg">Egg</option>
          <option value="eggless">Eggless</option>
        </select>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="px-4 py-3 rounded-xl border border-blush focus:outline-none"
        >
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CakeCardSkeleton key={i} />
          ))}
        </div>
      ) : cakes.length === 0 ? (
        <p className="text-center text-chocolate/60 py-20">No cakes found matching your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cakes.map((cake) => (
            <CakeCard
              key={cake._id}
              cake={cake}
              isWishlisted={wishlistIds.includes(cake._id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => updateParam("page", String(i + 1))}
              className={`w-10 h-10 rounded-full ${
                page === i + 1 ? "bg-rose text-white" : "bg-white border border-blush"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CakesList;
