import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext.jsx";
import { validateCouponApi } from "../api/couponApi.js";
import Loader from "../components/common/Loader.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const resolveImage = (img) => (img ? (img.startsWith("http") ? img : `${API_BASE}${img}`) : "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=300&q=80");

const DELIVERY_CHARGE = 60;
const TAX_RATE = 0.05;
const FREE_DELIVERY_THRESHOLD = 999;

const Cart = () => {
  const { cart, loading, refreshCart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");

  useEffect(() => {
    refreshCart();
  }, []);

  const subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_CHARGE;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const grandTotal = subtotal - discount + deliveryCharge + tax;

  const applyCoupon = async () => {
    if (!couponInput) return;
    try {
      const { data } = await validateCouponApi({ code: couponInput, orderValue: subtotal });
      setDiscount(data.discount);
      setCouponApplied(couponInput.toUpperCase());
      toast.success(`Coupon applied! You saved ₹${data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-chocolate/60 mb-8">Looks like you haven't added any delicious cakes yet.</p>
        <Link to="/cakes" className="btn-primary">
          Browse Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4">
              <img src={resolveImage(item.image)} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-chocolate/60">
                  {item.weight && `${item.weight} • `}
                  {item.flavour && `${item.flavour} • `}
                  {item.eggType}
                </p>
                {item.messageOnCake && (
                  <p className="text-sm text-chocolate/50 italic">"{item.messageOnCake}"</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 border border-blush rounded-full px-3 py-1">
                    <button onClick={() => updateItem(item._id, item.quantity - 1)}>
                      <FaMinus size={10} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItem(item._id, item.quantity + 1)}>
                      <FaPlus size={10} />
                    </button>
                  </div>
                  <p className="font-semibold text-rose">₹{item.price * item.quantity}</p>
                </div>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-chocolate/40 hover:text-red-500">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex gap-2 mb-4">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 rounded-xl border border-blush focus:outline-none text-sm"
            />
            <button onClick={applyCoupon} className="btn-secondary !px-4 !py-2 text-sm">
              Apply
            </button>
          </div>
          {couponApplied && (
            <p className="text-sage text-sm mb-4">Coupon "{couponApplied}" applied</p>
          )}

          <div className="space-y-2 text-sm border-t border-blush pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sage">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-blush pt-3 mt-2">
              <span>Grand Total</span>
              <span className="text-rose">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout", { state: { couponCode: couponApplied, discount } })}
            className="btn-primary w-full mt-6"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
