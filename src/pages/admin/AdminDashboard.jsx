import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaHourglassHalf, FaCheckCircle, FaUsers, FaRupeeSign, FaStar } from "react-icons/fa";
import { getDashboardApi } from "../../api/adminApi.js";
import Loader from "../../components/common/Loader.jsx";

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-chocolate/60">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardApi()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!data) return null;

  const { stats, popularCakes, statusBreakdown, dailyRevenue } = data;
  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard icon={<FaShoppingBag />} label="Today's Orders" value={stats.todaysOrders} color="bg-rose" />
        <StatCard icon={<FaHourglassHalf />} label="Pending Orders" value={stats.pendingOrders} color="bg-caramel" />
        <StatCard icon={<FaCheckCircle />} label="Completed Orders" value={stats.completedOrders} color="bg-sage" />
        <StatCard icon={<FaUsers />} label="Registered Users" value={stats.totalUsers} color="bg-chocolate" />
        <StatCard icon={<FaRupeeSign />} label="Total Revenue" value={`₹${stats.totalRevenue}`} color="bg-rose" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Revenue (Last 7 Days)</h2>
          <div className="flex items-end gap-3 h-48">
            {dailyRevenue.length === 0 && <p className="text-chocolate/50 text-sm">No data yet</p>}
            {dailyRevenue.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col items-center justify-end gap-2">
                <div
                  className="w-full bg-rose rounded-t-lg transition-all"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: 4 }}
                  title={`₹${d.revenue}`}
                />
                <span className="text-xs text-chocolate/50">{d._id.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Order Status Breakdown</h2>
          <div className="space-y-2">
            {statusBreakdown.map((s) => (
              <div key={s._id} className="flex items-center justify-between text-sm">
                <span>{s._id}</span>
                <div className="flex items-center gap-2 flex-1 mx-3">
                  <div className="h-2 bg-blush/40 rounded-full flex-1">
                    <div
                      className="h-2 bg-rose rounded-full"
                      style={{ width: `${(s.count / Math.max(...statusBreakdown.map((x) => x.count))) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-medium">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FaStar className="text-caramel" /> Popular Cakes</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {popularCakes.map((cake) => (
            <div key={cake._id} className="text-center">
              <div className="w-full h-24 bg-blush/30 rounded-xl mb-2 flex items-center justify-center text-2xl">🎂</div>
              <p className="text-sm font-medium truncate">{cake.name}</p>
              <p className="text-xs text-caramel">★ {cake.rating} ({cake.numReviews})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
