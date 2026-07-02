import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getMyOrdersApi } from "../api/orderApi.js";
import Loader from "../components/common/Loader.jsx";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-blue-100 text-blue-700",
  Preparing: "bg-indigo-100 text-indigo-700",
  Baking: "bg-orange-100 text-orange-700",
  Decorating: "bg-purple-100 text-purple-700",
  "Out For Delivery": "bg-cyan-100 text-cyan-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_STEPS = ["Pending", "Accepted", "Preparing", "Baking", "Decorating", "Out For Delivery", "Delivered"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMyOrdersApi()
      .then(({ data }) => { setOrders(data.orders); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-chocolate mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h3 className="font-display text-2xl text-chocolate mb-2">No Orders Yet</h3>
          <p className="text-chocolate/60 mb-8">Start by ordering your favourite cake!</p>
          <Link to="/cakes" className="btn-primary">Browse Cakes</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order._id} layout className="card overflow-visible">
              {/* Header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-rose text-lg">{order.orderId}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-chocolate/50 mt-1">
                    Ordered: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-chocolate text-lg">₹{order.grandTotal}</p>
                  <p className="text-xs text-chocolate/50">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === order._id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-blush px-5 pb-5"
                >
                  {/* Status tracker */}
                  {order.status !== "Cancelled" && (
                    <div className="pt-5 mb-5">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-4 h-0.5 bg-blush -z-0" />
                        {STATUS_STEPS.map((step, i) => {
                          const activeIdx = STATUS_STEPS.indexOf(order.status);
                          const done = i <= activeIdx;
                          return (
                            <div key={step} className="flex flex-col items-center z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                done ? "bg-rose border-rose text-white" : "bg-white border-blush text-blush"
                              }`}>
                                {done ? "✓" : i + 1}
                              </div>
                              <span className="text-xs text-chocolate/50 mt-1 hidden sm:block text-center w-16 leading-tight">{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-blush pb-2 last:border-0">
                        <div>
                          <p className="font-medium text-chocolate">{item.name} × {item.quantity}</p>
                          <p className="text-xs text-chocolate/50">{[item.weight, item.flavour].filter(Boolean).join(" · ")}</p>
                          {item.messageOnCake && <p className="text-xs text-rose">✏️ {item.messageOnCake}</p>}
                        </div>
                        <span className="font-semibold text-chocolate">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="bg-cream rounded-xl p-3 text-sm text-chocolate/70">
                    <p className="font-semibold text-chocolate mb-1">Delivery Address</p>
                    <p>{order.address.fullName} · {order.address.phone}</p>
                    <p>{order.address.addressLine}, {order.address.city}, {order.address.state} — {order.address.pincode}</p>
                    <p className="mt-1">
                      Slot: <strong>{order.preferredTimeSlot}</strong> on{" "}
                      <strong>{new Date(order.deliveryDate).toLocaleDateString("en-IN")}</strong>
                    </p>
                  </div>

                  {/* Totals */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center">
                    <div className="bg-white border border-blush rounded-xl p-2"><p className="text-chocolate/50 text-xs">Subtotal</p><p className="font-semibold">₹{order.itemsTotal}</p></div>
                    <div className="bg-white border border-blush rounded-xl p-2"><p className="text-chocolate/50 text-xs">Discount</p><p className="font-semibold text-sage">−₹{order.discount}</p></div>
                    <div className="bg-white border border-blush rounded-xl p-2"><p className="text-chocolate/50 text-xs">Delivery</p><p className="font-semibold">{order.deliveryCharge === 0 ? "Free" : `₹${order.deliveryCharge}`}</p></div>
                    <div className="bg-rose/10 border border-rose rounded-xl p-2"><p className="text-chocolate/50 text-xs">Total</p><p className="font-bold text-rose">₹{order.grandTotal}</p></div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
