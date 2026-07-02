import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import CakeCard from "../components/cake/CakeCard.jsx";
import CakeCardSkeleton from "../components/cake/CakeCardSkeleton.jsx";
import { getCakesApi } from "../api/cakeApi.js";
import { getCategoriesApi } from "../api/categoryApi.js";
import { addToWishlistApi, getWishlistApi, removeFromWishlistApi } from "../api/wishlistApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

const TESTIMONIALS = [
  { name: "Priya Sharma", rating: 5, text: "Absolutely divine cakes! The truffle cake was the highlight of my daughter's birthday.", avatar: "PS" },
  { name: "Rahul Mehta", rating: 5, text: "Ordered a custom anniversary cake – it was stunning and tasted even better.", avatar: "RM" },
  { name: "Anjali Nair", rating: 5, text: "Fresh, hygienic, and delivered on time. Will definitely order again!", avatar: "AN" },
];

const FAQS = [
  { q: "How far in advance should I order?", a: "We recommend ordering at least 24 hours in advance. Custom cakes may need 48–72 hours." },
  { q: "Do you offer eggless cakes?", a: "Yes! All our cakes can be made eggless on request. We have a dedicated eggless menu too." },
  { q: "What areas do you deliver to?", a: "We currently deliver within the city. Outstation orders are available for select pincode areas." },
  { q: "Can I add a custom message?", a: "Absolutely. You can add a message on the cake from the product detail page when ordering." },
];

const WHY_US = [
  { icon: "🧁", title: "Baked Fresh", desc: "Every cake is made fresh on the day of delivery." },
  { icon: "🌿", title: "Natural Ingredients", desc: "No preservatives, only quality natural ingredients." },
  { icon: "🚀", title: "On-Time Delivery", desc: "We guarantee on-time delivery or your money back." },
  { icon: "✏️", title: "Custom Designs", desc: "Personalized cakes for every occasion." },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [feat, best, cats] = await Promise.all([
        getCakesApi({ featured: "true", limit: 4 }),
        getCakesApi({ bestSeller: "true", limit: 4 }),
        getCategoriesApi(),
      ]);
      setFeaturedCakes(feat.data.cakes);
      setBestSellers(best.data.cakes);
      setCategories(cats.data.categories.slice(0, 5));
      if (isAuthenticated) {
        const wl = await getWishlistApi();
        setWishlist(wl.data.wishlist.map((c) => c._id));
      }
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [isAuthenticated]);

  const toggleWishlist = async (cakeId) => {
    if (wishlist.includes(cakeId)) {
      await removeFromWishlistApi(cakeId);
      setWishlist((prev) => prev.filter((id) => id !== cakeId));
    } else {
      await addToWishlistApi(cakeId);
      setWishlist((prev) => [...prev, cakeId]);
    }
  };

  const CATEGORY_IMAGES = {
    "chocolate-cakes": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    "birthday-cakes": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "anniversary-cakes": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80",
    "cupcakes": "https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=400&q=80",
    "eggless-cakes": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80",
  };

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br from-cream via-blush/60 to-rose/30">
        <div className="absolute inset-0 pointer-events-none">
          {["🍰", "🧁", "🎂", "🍫", "🌸"].map((e, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl opacity-20 select-none"
              style={{ top: `${10 + i * 18}%`, left: `${5 + i * 20}%` }}
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              {e}
            </motion.div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-rose/20 text-rose text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Fresh Homemade Cakes 🎉
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-chocolate leading-tight mb-5">
              Baked with <span className="text-rose">Love</span>, <br /> Delivered with Joy
            </h1>
            <p className="text-chocolate/65 text-lg mb-8 max-w-md">
              Handcrafted cakes for every celebration. Choose your flavour, customise your cake, and
              we'll deliver it fresh to your doorstep.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/cakes" className="btn-primary text-base">
                Order Now
              </Link>
              <Link to="/cakes" className="btn-secondary text-base">
                Explore Menu
              </Link>
            </div>
            <div className="flex gap-6 mt-10 text-sm text-chocolate/60">
              <div><span className="font-bold text-chocolate text-xl">500+</span><br />Happy Customers</div>
              <div><span className="font-bold text-chocolate text-xl">50+</span><br />Cake Varieties</div>
              <div><span className="font-bold text-chocolate text-xl">4.9★</span><br />Average Rating</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-rose/30 to-caramel/30 flex items-center justify-center shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80"
                  alt="Beautiful cake"
                  className="w-72 h-72 rounded-full object-cover shadow-xl"
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] rounded-full border-4 border-dashed border-rose/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Categories ---- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-chocolate mb-2">Shop by Category</h2>
            <p className="text-chocolate/60">Find your perfect cake from our wide variety</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/cakes?category=${cat._id}`}
                  className="group flex flex-col items-center p-4 rounded-2xl hover:bg-blush/40 transition-colors"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-soft">
                    <img
                      src={CATEGORY_IMAGES[cat.slug] || "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200&q=80"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="font-semibold text-chocolate text-sm text-center">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Featured Cakes ---- */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold text-chocolate">Featured Cakes</h2>
              <p className="text-chocolate/60 mt-1">Handpicked by our bakers</p>
            </div>
            <Link to="/cakes" className="flex items-center gap-2 text-rose font-medium hover:gap-3 transition-all">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loading
              ? Array(4).fill(0).map((_, i) => <CakeCardSkeleton key={i} />)
              : featuredCakes.map((cake) => (
                  <CakeCard
                    key={cake._id}
                    cake={cake}
                    isWishlisted={wishlist.includes(cake._id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ---- Best Sellers ---- */}
      {bestSellers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-display text-4xl font-bold text-chocolate">Best Sellers</h2>
                <p className="text-chocolate/60 mt-1">Customer favourites, week after week</p>
              </div>
              <Link to="/cakes?sort=rating" className="flex items-center gap-2 text-rose font-medium hover:gap-3 transition-all">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.map((cake) => (
                <CakeCard
                  key={cake._id}
                  cake={cake}
                  isWishlisted={wishlist.includes(cake._id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Why Choose Us ---- */}
      <section className="py-20 bg-gradient-to-r from-chocolate to-chocolate/80 text-cream">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-blush mb-2">Why Choose Sweet Crumbs?</h2>
          <p className="text-cream/60 mb-12">We bake every cake as if it's for our own family.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {WHY_US.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 rounded-2xl p-6"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg font-semibold text-blush mb-2">{item.title}</h3>
                <p className="text-cream/70 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-chocolate mb-2">What Our Customers Say</h2>
            <p className="text-chocolate/60">Real love from real customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.15 }}
                className="card p-6"
              >
                <div className="flex text-caramel mb-3">
                  {Array(t.rating).fill(0).map((_, j) => <FaStar key={j} />)}
                </div>
                <p className="text-chocolate/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-white font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <span className="font-semibold text-chocolate">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-chocolate mb-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-blush rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 font-semibold text-chocolate flex justify-between items-center"
                >
                  {f.q}
                  <span className="text-rose text-xl">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-6 pb-4 text-chocolate/65 text-sm leading-relaxed"
                  >
                    {f.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="py-16 bg-gradient-to-r from-rose to-caramel text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Order Your Dream Cake?</h2>
          <p className="text-white/80 mb-8">Place your order now and get it delivered to your door fresh!</p>
          <Link to="/cakes" className="bg-white text-rose px-8 py-3 rounded-full font-semibold hover:bg-cream transition-colors">
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
