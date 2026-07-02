import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { getAllOrdersApi, updateOrderStatusApi } from "../../api/orderApi.js";
import Loader from "../../components/common/Loader.jsx";

const STATUSES = ["Pending", "Accepted", "Preparing", "Baking", "Decorating", "Out For Delivery", "Delivered", "Cancelled"];

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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async (pg = 1) => {
    setLoading(true);
    const { data } = await getAllOrdersApi({ page: pg, limit: 20, search, status: filterStatus });
    setOrders(data.orders);
    setPages(data.pages);
    setPage(pg);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(1); }, [search, filterStatus]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatusApi({ orderId, status });
      toast.success("Status updated");
      fetchOrders(page);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-chocolate mb-6">Order Management</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, name, phone…"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-blush text-sm outline-none focus:border-rose bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-blush text-sm bg-white outline-none"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-chocolate/50">No orders found</div>
          ) : orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-rose">{order.orderId}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="text-xs text-chocolate/50">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-chocolate">₹{order.grandTotal}</span>
                  <span className="text-xs text-chocolate/50">{order.user?.firstName} {order.user?.lastName}</span>
                </div>
              </div>

              {expanded === order._id && (
                <div className="border-t border-blush px-4 pb-4">
                  {/* Items */}
                  <div className="mt-4 space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-chocolate/70">
                        <span>{item.name} × {item.quantity} {item.weight && `(${item.weight})`}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="bg-cream rounded-xl p-3 text-sm text-chocolate/70 mb-4">
                    <p className="font-semibold text-chocolate">{order.address?.fullName} · {order.address?.phone}</p>
                    <p>{order.address?.addressLine}, {order.address?.city} — {order.address?.pincode}</p>
                    <p className="mt-1">Delivery: <strong>{new Date(order.deliveryDate).toLocaleDateString("en-IN")}</strong> | Slot: <strong>{order.preferredTimeSlot}</strong></p>
                    {order.specialDeliveryNotes && <p className="text-rose text-xs mt-1">📝 {order.specialDeliveryNotes}</p>}
                  </div>

                  {/* Status change */}
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.filter((s) => s !== order.status).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(order._id, s)}
                        className="px-3 py-1 text-xs bg-rose/10 text-rose border border-rose rounded-full hover:bg-rose hover:text-white transition-colors"
                      >
                        Mark as {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array(pages).fill(0).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchOrders(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-medium ${page === i + 1 ? "bg-rose text-white" : "bg-white text-chocolate border border-blush"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
