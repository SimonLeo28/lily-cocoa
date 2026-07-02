import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaTrash, FaTag, FaArrowRight } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { validateCouponApi } from "../api/couponApi.js";
import Loader from "../components/common/Loader.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const resolveImg = (img) =>
  img ? (img.startsWith("http") ? img : `${API_BASE}${img}`) : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80";

const DELIVERY_CHARGE = 60;
const FREE_DELIVERY_THRESHOLD = 999;
const TAX_RATE = 0.05;

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, refreshCart, updateItem, removeItem, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { refreshCart(); }, []);

  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const grandTotal = subtotal - discount + deliveryCharge + tax;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await validateCouponApi({ code: couponCode.trim(), orderValue: subtotal });
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: data.discount });
      toast.success(`Coupon applied! You save ₹${data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponCode(""); };

  if (loading) return <Loader />;

  if (!cart.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="font-display text-3xl font-bold text-chocolate mb-3">Your Cart is Empty</h2>
        <p className="text-chocolate/60 mb-8">Looks like you haven't added any cakes yet!</p>
        <Link to="/cakes" className="btn-primary">Browse Cakes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-chocolate mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card flex gap-4 p-4"
            >
              <img
                src={resolveImg(item.image)}
                alt={item.name}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-chocolate truncate">{item.name}</h3>
                <div className="text-xs text-chocolate/50 mt-1 space-x-2">
                  {item.weight && <span>Weight: {item.weight}</span>}
                  {item.flavour && <span>Flavour: {item.flavour}</span>}
                  {item.eggType && <span className="capitalize">{item.eggType}</span>}
                </div>
                {item.messageOnCake && (
                  <p className="text-xs text-rose mt-1">✏️ "{item.messageOnCake}"</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-blush/40 rounded-xl px-2 py-1">
                    <button onClick={() => updateItem(item._id, item.quantity - 1)} className="w-6 h-6 text-rose font-bold text-lg">−</button>
                    <span className="font-semibold text-chocolate w-5 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateItem(item._id, item.quantity + 1)} className="w-6 h-6 text-rose font-bold text-lg">+</button>
                  </div>
                  <span className="font-bold text-rose">₹{item.price * item.quantity}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-chocolate/30 hover:text-rose self-start flex-shrink-0">
                <FaTrash />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-5">
            <h3 className="font-semibold text-chocolate mb-3 flex items-center gap-2">
              <FaTag className="text-rose" /> Apply Coupon
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-sage/20 rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-sage">{appliedCoupon.code} — −₹{appliedCoupon.discount}</span>
                <button onClick={removeCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 rounded-xl border border-blush text-sm outline-none focus:border-rose"
                />
                <button onClick={applyCoupon} disabled={couponLoading} className="btn-primary !px-4 !py-2 text-sm">
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-chocolate text-lg mb-1">Order Summary</h3>
            <div className="flex justify-between text-sm text-chocolate/70">
              <span>Items ({cart.items?.length})</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-sage font-medium">
                <span>Coupon Discount</span>
                <span>−₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-chocolate/70">
              <span>Delivery {subtotal >= FREE_DELIVERY_THRESHOLD && <span className="text-sage">(Free!)</span>}</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-sm text-chocolate/70">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="border-t border-blush pt-3 flex justify-between font-bold text-chocolate text-lg">
              <span>Grand Total</span>
              <span className="text-rose">₹{grandTotal}</span>
            </div>

            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <p className="text-xs text-chocolate/50">
                Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} more for free delivery!
              </p>
            )}

            <button
              onClick={() => navigate("/checkout", { state: { couponCode: appliedCoupon?.code, discount, grandTotal, deliveryCharge, tax, subtotal } })}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
