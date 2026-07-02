import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { getOrderByIdApi } from "../api/orderApi.js";
import Loader from "../components/common/Loader.jsx";

const STATUS_FLOW = ["Pending", "Accepted", "Preparing", "Baking", "Decorating", "Out For Delivery", "Delivered"];

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const resolveImage = (img) => (img ? (img.startsWith("http") ? img : `${API_BASE}${img}`) : "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200&q=80");

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByIdApi(id)
      .then((res) => setOrder(res.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  const currentStepIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{order.orderId}</h1>
            <p className="text-chocolate/60 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className="px-4 py-2 bg-blush/30 rounded-full text-sm font-medium">{order.status}</span>
        </div>

        {order.status !== "Cancelled" && (
          <div className="flex flex-wrap gap-2 mt-6">
            {STATUS_FLOW.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs px-3 py-2 rounded-full ${
                  idx <= currentStepIndex ? "bg-sage text-white" : "bg-blush/30 text-chocolate/50"
                }`}>
                  {idx <= currentStepIndex && <FaCheckCircle />} {step}
                </div>
                {idx < STATUS_FLOW.length - 1 && <div className="w-4 h-0.5 bg-blush" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <img src={resolveImage(item.image)} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-chocolate/60">{item.weight} • {item.flavour} • {item.eggType}</p>
                {item.messageOnCake && <p className="text-sm italic text-chocolate/50">"{item.messageOnCake}"</p>}
              </div>
              <p className="font-semibold">₹{item.price} × {item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-blush mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Items Total</span><span>₹{order.itemsTotal}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sage"><span>Discount</span><span>-₹{order.discount}</span></div>}
          <div className="flex justify-between"><span>Delivery</span><span>{order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Grand Total</span><span className="text-rose">₹{order.grandTotal}</span></div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
        <p className="font-medium">{order.address?.fullName}</p>
        <p className="text-chocolate/60 text-sm">{order.address?.phone}</p>
        <p className="text-chocolate/60 text-sm">
          {order.address?.addressLine}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
        </p>
        {order.address?.landmark && <p className="text-chocolate/60 text-sm">Landmark: {order.address.landmark}</p>}
        <p className="text-chocolate/60 text-sm mt-2">
          Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()} ({order.preferredTimeSlot})
        </p>
        {order.specialDeliveryNotes && (
          <p className="text-chocolate/60 text-sm">Notes: {order.specialDeliveryNotes}</p>
        )}
        <p className="text-chocolate/60 text-sm mt-2">Payment: {order.paymentMethod}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
