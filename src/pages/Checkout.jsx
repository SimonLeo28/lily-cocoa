import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext.jsx";
import { getAddressesApi } from "../api/addressApi.js";
import { createOrderApi } from "../api/orderApi.js";

const DELIVERY_CHARGE = 60;
const TAX_RATE = 0.05;
const FREE_DELIVERY_THRESHOLD = 999;

const timeSlots = ["9 AM - 12 PM", "12 PM - 3 PM", "3 PM - 6 PM", "6 PM - 9 PM"];

const Checkout = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { couponCode, discount = 0 } = location.state || {};
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSaved, setUseSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    getAddressesApi().then((res) => setSavedAddresses(res.data.addresses));
  }, []);

  const subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const grandTotal = subtotal - discount + deliveryCharge + tax;

  const fillSavedAddress = (addr) => {
    setValue("fullName", addr.fullName);
    setValue("phone", addr.phone);
    setValue("alternatePhone", addr.alternatePhone);
    setValue("addressLine", addr.addressLine);
    setValue("city", addr.city);
    setValue("state", addr.state);
    setValue("pincode", addr.pincode);
    setValue("landmark", addr.landmark);
  };

  const onSubmit = async (data) => {
    if (!cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const { data: res } = await createOrderApi({
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
        couponCode,
      });
      await refreshCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose";
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <p className="font-medium mb-2">Saved Addresses</p>
          <div className="flex flex-wrap gap-3">
            {savedAddresses.map((addr) => (
              <button
                key={addr._id}
                type="button"
                onClick={() => fillSavedAddress(addr)}
                className="btn-secondary !px-4 !py-2 text-sm"
              >
                {addr.label}: {addr.city}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 card p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">Delivery Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input className={inputClass} {...register("fullName", { required: "Required" })} />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input className={inputClass} {...register("phone", { required: "Required" })} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Alternate Phone</label>
            <input className={inputClass} {...register("alternatePhone")} />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea className={inputClass} rows={2} {...register("addressLine", { required: "Required" })} />
            {errors.addressLine && <p className="text-red-500 text-sm">{errors.addressLine.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">City</label>
              <input className={inputClass} {...register("city", { required: "Required" })} />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <input className={inputClass} {...register("state", { required: "Required" })} />
            </div>
            <div>
              <label className="text-sm font-medium">Pincode</label>
              <input className={inputClass} {...register("pincode", { required: "Required" })} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Landmark</label>
            <input className={inputClass} {...register("landmark")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Delivery Date</label>
              <input type="date" min={today} className={inputClass} {...register("deliveryDate", { required: "Required" })} />
              {errors.deliveryDate && <p className="text-red-500 text-sm">{errors.deliveryDate.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Time Slot</label>
              <select className={inputClass} {...register("preferredTimeSlot", { required: "Required" })}>
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {errors.preferredTimeSlot && <p className="text-red-500 text-sm">{errors.preferredTimeSlot.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Special Delivery Notes</label>
            <textarea className={inputClass} rows={2} {...register("specialDeliveryNotes")} />
          </div>

          <div className="bg-blush/20 rounded-xl p-4 text-sm">
            <p className="font-medium">Payment Method: Cash on Delivery (COD)</p>
            <p className="text-chocolate/60">Pay in cash when your order is delivered.</p>
          </div>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discount > 0 && <div className="flex justify-between text-sage"><span>Discount</span><span>-₹{discount}</span></div>}
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
            <div className="flex justify-between font-bold text-lg border-t border-blush pt-3 mt-2">
              <span>Total</span><span className="text-rose">₹{grandTotal}</span>
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
            {submitting ? "Placing Order..." : "Place Order (COD)"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
