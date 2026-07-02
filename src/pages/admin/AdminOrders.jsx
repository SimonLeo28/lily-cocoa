import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllOrdersApi, updateOrderStatusApi } from "../../api/orderApi.js";
import Loader from "../../components/common/Loader.jsx";

const ORDER_STATUSES = [
  "Pending", "Accepted", "Preparing", "Baking", "Decorating", "Out For Delivery", "Delivered", "Cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrdersApi({ status, search });
      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi({ orderId, status: newStatus });
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error("Could not update status");
    }
  };

  const printInvoice = (order) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Invoice ${order.orderId}</title>
      <style>body{font-family:sans-serif;padding:40px;} table{width:100%;border-collapse:collapse;} td,th{border:1px solid #ccc;padding:8px;text-align:left;}</style>
      </head><body>
      <h1>Invoice - ${order.orderId}</h1>
      <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
      <p>Customer: ${order.address?.fullName} (${order.address?.phone})</p>
      <p>Address: ${order.address?.addressLine}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
      ${order.items.map((i) => `<tr><td>${i.name} (${i.weight})</td><td>${i.quantity}</td><td>₹${i.price}</td><td>₹${i.price * i.quantity}</td></tr>`).join("")}
      </tbody></table>
      <h3>Grand Total: ₹${order.grandTotal}</h3>
      <p>Payment Method: ${order.paymentMethod}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search by Order ID, name, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="flex-1 px-4 py-3 rounded-xl border border-blush focus:outline-none"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-3 rounded-xl border border-blush">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={load} className="btn-primary !px-6">Search</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blush/20">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-blush/30">
                <td className="p-3 font-medium">{order.orderId}</td>
                <td className="p-3">{order.user?.firstName} {order.user?.lastName}</td>
                <td className="p-3">{order.items.length}</td>
                <td className="p-3">₹{order.grandTotal}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-2 py-1 rounded-lg border border-blush text-xs"
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setSelectedOrder(order)} className="text-rose hover:underline text-xs">View</button>
                  <button onClick={() => printInvoice(order)} className="text-chocolate hover:underline text-xs">Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <div className="card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{selectedOrder.orderId}</h2>
            {selectedOrder.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm py-2 border-b border-blush/30">
                <span>{i.name} ({i.weight}) × {i.quantity}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
            <p className="font-bold mt-4">Total: ₹{selectedOrder.grandTotal}</p>
            <p className="text-sm text-chocolate/60 mt-2">{selectedOrder.address?.fullName}, {selectedOrder.address?.addressLine}, {selectedOrder.address?.city}</p>
            <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
