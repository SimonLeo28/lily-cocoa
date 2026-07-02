import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import CakeCard from "../components/cake/CakeCard.jsx";
import CakeCardSkeleton from "../components/cake/CakeCardSkeleton.jsx";
import { getCakesApi } from "../api/cakeApi.js";
import { getCategoriesApi } from "../api/categoryApi.js";
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from "../api/wishlistApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const SORTS = [
  { value: "", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
];

const CatalogPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [eggType, setEggType] = useState(searchParams.get("eggType") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const fetchCakes = useCallback(async (pg = 1) => {
    setLoading(true);
    const params = { page: pg, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (eggType) params.eggType = eggType;
    if (sort) params.sort = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    const { data } = await getCakesApi(params);
    setCakes(data.cakes);
    setTotal(data.total);
    setPages(data.pages);
    setPage(pg);
    setLoading(false);
  }, [search, category, eggType, sort, minPrice, maxPrice]);

  useEffect(() => {
    getCategoriesApi().then(({ data }) => setCategories(data.categories));
    if (isAuthenticated) {
      getWishlistApi().then(({ data }) => setWishlist(data.wishlist.map((c) => c._id)));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCakes(1);
  }, [fetchCakes]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCakes(1);
  };

  const toggleWishlist = async (cakeId) => {
    if (wishlist.includes(cakeId)) {
      await removeFromWishlistApi(cakeId);
      setWishlist((p) => p.filter((id) => id !== cakeId));
    } else {
      await addToWishlistApi(cakeId);
      setWishlist((p) => [...p, cakeId]);
    }
  };

  const clearFilters = () => {
    setSearch(""); setCategory(""); setEggType(""); setSort(""); setMinPrice(""); setMaxPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-chocolate">Browse Cakes</h1>
        <p className="text-chocolate/60 mt-1">{total} cakes available</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cakes…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-blush bg-white outline-none focus:border-rose"
            />
          </div>
          <button type="submit" className="btn-primary !px-5 !py-3">Search</button>
        </form>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl border border-blush bg-white outline-none text-sm"
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 btn-secondary !px-4 !py-3 text-sm"
        >
          <FaFilter /> Filters
        </button>
      </div>

      {/* Filters Panel */}
      {filterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white rounded-2xl p-5 mb-6 border border-blush grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-chocolate/60 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-blush text-sm outline-none"
            >
              <option value="">All</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-chocolate/60 mb-1">Egg Type</label>
            <select
              value={eggType}
              onChange={(e) => setEggType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-blush text-sm outline-none"
            >
              <option value="">Any</option>
              <option value="eggless">Eggless</option>
              <option value="egg">With Egg</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-chocolate/60 mb-1">Min Price (₹)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-blush text-sm outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-chocolate/60 mb-1">Max Price (₹)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-blush text-sm outline-none"
              placeholder="5000"
            />
          </div>
          <div className="col-span-2 md:col-span-4 flex gap-3">
            <button onClick={() => fetchCakes(1)} className="btn-primary !px-5 !py-2 text-sm">Apply</button>
            <button onClick={clearFilters} className="btn-secondary !px-5 !py-2 text-sm">Clear</button>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <CakeCardSkeleton key={i} />)}
        </div>
      ) : cakes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-2xl text-chocolate mb-2">No cakes found</h3>
          <p className="text-chocolate/60">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cakes.map((cake) => (
              <CakeCard
                key={cake._id}
                cake={cake}
                isWishlisted={wishlist.includes(cake._id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array(pages).fill(0).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchCakes(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    page === i + 1 ? "bg-rose text-white" : "bg-white text-chocolate border border-blush hover:bg-blush"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogPage;
