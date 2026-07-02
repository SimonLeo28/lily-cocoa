import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaShippingFast, FaLeaf, FaAward, FaHeadset } from "react-icons/fa";
import toast from "react-hot-toast";
import { getCakesApi } from "../api/cakeApi.js";
import { getCategoriesApi } from "../api/categoryApi.js";
import CakeCard from "../components/cake/CakeCard.jsx";
import CakeCardSkeleton from "../components/cake/CakeCardSkeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const reviews = [
  { name: "Ananya R.", text: "The chocolate truffle cake was absolutely heavenly! Will order again.", rating: 5 },
  { name: "Rohit S.", text: "Beautifully decorated and tasted even better than it looked.", rating: 5 },
  { name: "Priya M.", text: "On-time delivery and the eggless option was a lifesaver for my mom's birthday.", rating: 4 },
];

const faqs = [
  { q: "Do you deliver same-day?", a: "Yes, for orders placed before 12 PM, subject to availability in your area." },
  { q: "Are eggless options available?", a: "Absolutely! Most of our cakes have an eggless variant you can select on the product page." },
  { q: "What payment methods are accepted?", a: "Currently we only support Cash on Delivery (COD) for all orders." },
  { q: "Can I customize the cake message?", a: "Yes, you can add a custom message on the cake during checkout from the product page." },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, bestRes, catRes] = await Promise.all([
          getCakesApi({ featured: true, limit: 4 }),
          getCakesApi({ bestSeller: true, limit: 4 }),
          getCategoriesApi(),
        ]);
        setFeatured(featuredRes.data.cakes);
        setBestSellers(bestRes.data.cakes);
        setCategories(catRes.data.categories);
      } catch (err) {
        // fail silently on home page
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blush/40 via-cream to-caramel/20 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-rose/10 text-rose px-4 py-1 rounded-full text-sm font-medium mb-4">
              Freshly Baked, Daily
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Handmade Cakes, <span className="text-rose">Baked with Love</span>
            </h1>
            <p className="text-chocolate/70 text-lg mb-8 max-w-md">
              Premium homemade cakes crafted from the finest ingredients, delivered fresh to your doorstep.
            </p>
            <div className="flex gap-4">
              <Link to="/cakes" className="btn-primary">
                Order Now
              </Link>
              <Link to="/cakes" className="btn-secondary">
                Explore Menu
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
              alt="Premium Cake"
              className="rounded-[2.5rem] shadow-soft w-full object-cover h-80 md:h-[420px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/cakes?category=${cat._id}`}
              className="card p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-blush/40 flex items-center justify-center text-2xl mb-2">
                🎂
              </div>
              <p className="font-medium text-sm">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="bg-blush/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Featured Cakes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <CakeCardSkeleton key={i} />)
              : featured.map((cake) => (
                  <CakeCard key={cake._id} cake={cake} />
                ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CakeCardSkeleton key={i} />)
            : bestSellers.map((cake) => <CakeCard key={cake._id} cake={cake} />)}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-chocolate text-cream py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: <FaLeaf size={28} />, label: "Fresh Ingredients" },
            { icon: <FaShippingFast size={28} />, label: "Fast Delivery" },
            { icon: <FaAward size={28} />, label: "Premium Quality" },
            { icon: <FaHeadset size={28} />, label: "24/7 Support" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <div className="text-rose">{item.icon}</div>
              <p className="font-medium text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
          alt="Bakery"
          className="rounded-[2.5rem] shadow-soft w-full h-72 object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">About Sweet Crumbs</h2>
          <p className="text-chocolate/70 leading-relaxed">
            Sweet Crumbs started as a small home bakery with a passion for crafting beautiful, delicious cakes for
            every occasion. Today, we continue that tradition with the same handmade care, using only the finest
            ingredients to bring joy to your celebrations.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-blush/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "1578985545062-69928b1d9587",
              "1535141192574-5d4897c12636",
              "1606312619070-d48b4c652a52",
              "1486427944299-d1955d23e34d",
            ].map((id, idx) => (
              <img
                key={idx}
                src={`https://images.unsplash.com/photo-${id}?w=500&q=80`}
                alt="Gallery cake"
                className="rounded-2xl h-44 w-full object-cover shadow-soft hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="card p-6">
              <div className="flex text-caramel mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-chocolate/70 mb-4">"{r.text}"</p>
              <p className="font-semibold">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-blush/10 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div key={idx} className="card p-4 cursor-pointer" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div className="flex justify-between items-center font-medium">
                  {f.q}
                  <span>{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && <p className="text-chocolate/60 text-sm mt-2">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
