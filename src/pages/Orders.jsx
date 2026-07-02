import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrdersApi } from "../api/orderApi.js";
import Loader from "../components/common/Loader.jsx";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  Baking: "bg-orange-100 text-orange-700",
  Decorating: "bg-pink-100 text-pink-700",
  "Out For Delivery": "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersApi()
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-chocolate/60 mb-6">You haven't placed any orders yet.</p>
          <Link to="/cakes" className="btn-primary">Browse Cakes</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex justify-between items-center hover:shadow-lg transition-shadow">
              <div>
                <p className="font-semibold">{order.orderId}</p>
                <p className="text-sm text-chocolate/60">{order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-chocolate/60">{order.address?.city}, {order.address?.state}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <p className="font-bold text-rose mt-2">₹{order.grandTotal}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
