import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaBan, FaTrash, FaHistory } from "react-icons/fa";
import { getAllUsersApi, toggleBlockUserApi, deleteUserApi, getUserOrderHistoryApi } from "../../api/adminApi.js";
import Loader from "../../components/common/Loader.jsx";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [orderHistory, setOrderHistory] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchUsers = async (pg = 1) => {
    setLoading(true);
    const { data } = await getAllUsersApi({ page: pg, limit: 15, search });
    setUsers(data.users);
    setPages(data.pages);
    setPage(pg);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(1); }, [search]);

  const handleBlock = async (id) => {
    try {
      const { data } = await toggleBlockUserApi(id);
      toast.success(data.message);
      fetchUsers(page);
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this user?")) return;
    try {
      await deleteUserApi(id);
      toast.success("User deleted");
      fetchUsers(page);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const viewOrders = async (user) => {
    setSelectedUser(user);
    setOrdersLoading(true);
    try {
      const { data } = await getUserOrderHistoryApi(user._id);
      setOrderHistory(data.orders);
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-chocolate mb-6">User Management</h1>

      <div className="relative mb-5 max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users…"
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-blush text-sm outline-none focus:border-rose bg-white"
        />
      </div>

      {/* Order History Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-chocolate">
                Orders — {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <button onClick={() => { setSelectedUser(null); setOrderHistory(null); }} className="text-chocolate/50 hover:text-rose text-2xl">✕</button>
            </div>
            {ordersLoading ? (
              <Loader />
            ) : orderHistory?.length === 0 ? (
              <p className="text-chocolate/50 text-center py-8">No orders found</p>
            ) : (
              <div className="space-y-3">
                {orderHistory?.map((o) => (
                  <div key={o._id} className="border border-blush rounded-2xl p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-bold text-rose">{o.orderId}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        o.status === "Delivered" ? "bg-green-100 text-green-700" :
                        o.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                      }`}>{o.status}</span>
                    </div>
                    <p className="text-chocolate/60 mt-1">₹{o.grandTotal} • {new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream text-chocolate/60 font-semibold">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Phone</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blush">
              {users.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-chocolate/50">No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u._id} className="hover:bg-cream/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span className="font-medium text-chocolate">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-chocolate/60 hidden md:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-chocolate/60 hidden sm:table-cell">{u.phone}</td>
                  <td className="px-4 py-3 text-chocolate/50 hidden lg:table-cell text-xs">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                    }`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => viewOrders(u)}
                        title="View Orders"
                        className="text-caramel hover:text-chocolate"
                      >
                        <FaHistory />
                      </button>
                      <button
                        onClick={() => handleBlock(u._id)}
                        title={u.isBlocked ? "Unblock" : "Block"}
                        className={`${u.isBlocked ? "text-green-500 hover:text-green-700" : "text-chocolate/40 hover:text-orange-500"}`}
                      >
                        <FaBan />
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="text-chocolate/30 hover:text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {Array(pages).fill(0).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchUsers(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-medium ${
                    page === i + 1 ? "bg-rose text-white" : "bg-cream text-chocolate"
                  }`}
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

export default AdminUsersPage;
