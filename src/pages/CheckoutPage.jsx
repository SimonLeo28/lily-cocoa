import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaTruck, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { createOrderApi } from "../api/orderApi.js";
import { getAddressesApi } from "../api/addressApi.js";
import { useCart } from "../context/CartContext.jsx";

const TIME_SLOTS = ["9 AM – 11 AM", "11 AM – 1 PM", "2 PM – 4 PM", "4 PM – 6 PM", "6 PM – 8 PM"];

const minDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const InputField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-chocolate mb-1">
      {label} {required && <span className="text-rose">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summary = location.state || {};
  const { cart, clearCart } = useCart();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getAddressesApi()
      .then(({ data }) => {
        setSavedAddresses(data.addresses);
        const def = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        if (def) prefillAddress(def);
      })
      .catch(() => {});
  }, []);

  const prefillAddress = (addr) => {
    setSelectedAddress(addr._id);
    setValue("fullName", addr.fullName);
    setValue("phone", addr.phone);
    setValue("alternatePhone", addr.alternatePhone || "");
    setValue("addressLine", addr.addressLine);
    setValue("city", addr.city);
    setValue("state", addr.state);
    setValue("pincode", addr.pincode);
    setValue("landmark", addr.landmark || "");
  };

  const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border ${err ? "border-red-400" : "border-blush"} bg-cream/50 outline-none focus:border-rose transition text-sm`;

  const onSubmit = async (data) => {
    if (!cart.items?.length) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        address: {
          fullName: data.fullName,
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          addressLine: data.addressLine,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          landmark: data.landmark,
        },
        deliveryDate: data.deliveryDate,
        preferredTimeSlot: data.preferredTimeSlot,
        specialDeliveryNotes: data.specialDeliveryNotes,
        couponCode: summary.couponCode || "",
      };

      const { data: res } = await createOrderApi(payload);
      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${res.order._id}`, { state: { order: res.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-chocolate mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">

          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-chocolate mb-4">Saved Addresses</h3>
              <div className="grid gap-3">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => prefillAddress(addr)}
                    className={`cursor-pointer border rounded-2xl p-4 text-sm transition-colors ${
                      selectedAddress === addr._id ? "border-rose bg-blush/30" : "border-blush hover:border-rose"
                    }`}
                  >
                    <p className="font-semibold text-chocolate">{addr.fullName} — {addr.label}</p>
                    <p className="text-chocolate/60 mt-1">{addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-chocolate/50 mt-3">Or fill in the form below for a new address</p>
            </div>
          )}

          {/* Delivery Address */}
          <div className="card p-6">
            <h3 className="font-semibold text-chocolate mb-5 flex items-center gap-2">
              <FaTruck className="text-rose" /> Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" error={errors.fullName?.message} required>
                <input className={inputCls(errors.fullName)} placeholder="John Doe" {...register("fullName", { required: "Required" })} />
              </InputField>
              <InputField label="Phone Number" error={errors.phone?.message} required>
                <input className={inputCls(errors.phone)} placeholder="9876543210" {...register("phone", { required: "Required", minLength: { value: 10, message: "Invalid phone" } })} />
              </InputField>
              <InputField label="Alternate Phone" error={errors.alternatePhone?.message}>
                <input className={inputCls(false)} placeholder="(optional)" {...register("alternatePhone")} />
              </InputField>
              <InputField label="Landmark" error={errors.landmark?.message}>
                <input className={inputCls(false)} placeholder="Near city park" {...register("landmark")} />
              </InputField>
              <div className="sm:col-span-2">
                <InputField label="Address Line" error={errors.addressLine?.message} required>
                  <input className={inputCls(errors.addressLine)} placeholder="House / Flat, Street, Area" {...register("addressLine", { required: "Required" })} />
                </InputField>
              </div>
              <InputField label="City" error={errors.city?.message} required>
                <input className={inputCls(errors.city)} placeholder="Bengaluru" {...register("city", { required: "Required" })} />
              </InputField>
              <InputField label="State" error={errors.state?.message} required>
                <input className={inputCls(errors.state)} placeholder="Karnataka" {...register("state", { required: "Required" })} />
              </InputField>
              <InputField label="Pincode" error={errors.pincode?.message} required>
                <input className={inputCls(errors.pincode)} placeholder="560001" {...register("pincode", { required: "Required", minLength: { value: 6, message: "Invalid pincode" } })} />
              </InputField>
            </div>
          </div>

          {/* Delivery Slot */}
          <div className="card p-6">
            <h3 className="font-semibold text-chocolate mb-5">Delivery Date & Slot</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="Delivery Date" error={errors.deliveryDate?.message} required>
                <input
                  type="date"
                  min={minDate()}
                  className={inputCls(errors.deliveryDate)}
                  {...register("deliveryDate", { required: "Select delivery date" })}
                />
              </InputField>
              <InputField label="Preferred Time Slot" error={errors.preferredTimeSlot?.message} required>
                <select className={inputCls(errors.preferredTimeSlot)} {...register("preferredTimeSlot", { required: "Select a time slot" })}>
                  <option value="">Choose slot</option>
                  {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>
            </div>
            <div className="mt-4">
              <InputField label="Special Delivery Notes">
                <textarea rows={2} className={`${inputCls(false)} resize-none`} placeholder="Leave at the door, call before arriving…" {...register("specialDeliveryNotes")} />
              </InputField>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h3 className="font-semibold text-chocolate mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-rose" /> Payment Method
            </h3>
            <div className="border-2 border-rose bg-rose/10 rounded-2xl p-4 flex items-center gap-3">
              <FaCheckCircle className="text-rose" />
              <div>
                <p className="font-semibold text-chocolate">Cash on Delivery (COD)</p>
                <p className="text-xs text-chocolate/60">Pay when your cake arrives at your door</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-60">
            {loading ? "Placing Order…" : "Place Order"}
          </button>
        </form>

        {/* Order Summary sidebar */}
        <div className="card p-5 h-fit space-y-3">
          <h3 className="font-semibold text-chocolate text-lg">Order Summary</h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {cart.items?.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-chocolate/70">
                <span className="truncate flex-1 mr-2">{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-blush pt-3 space-y-2 text-sm text-chocolate/70">
            <div className="flex justify-between"><span>Items Total</span><span>₹{summary.subtotal || 0}</span></div>
            {summary.discount > 0 && <div className="flex justify-between text-sage"><span>Discount</span><span>−₹{summary.discount}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{summary.deliveryCharge === 0 ? "FREE" : `₹${summary.deliveryCharge || 60}`}</span></div>
            <div className="flex justify-between"><span>GST</span><span>₹{summary.tax || 0}</span></div>
          </div>
          <div className="border-t border-blush pt-3 flex justify-between font-bold text-chocolate text-lg">
            <span>Total</span>
            <span className="text-rose">₹{summary.grandTotal || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
