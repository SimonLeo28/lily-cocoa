import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaShoppingBag, FaUsers, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaStar,
} from "react-icons/fa";
import { getDashboardApi } from "../../api/adminApi.js";
import Loader from "../../components/common/Loader.jsx";

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-5 shadow-soft flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-chocolate/60 text-xs font-medium">{label}</p>
      <p className="font-display text-2xl font-bold text-chocolate">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardApi()
      .then(({ data: res }) => { setData(res); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data) return <div>Failed to load dashboard</div>;

  const { stats, popularCakes, statusBreakdown, dailyRevenue } = data;
  const maxRev = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-chocolate mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<FaShoppingBag />} label="Today's Orders" value={stats.todaysOrders} color="bg-rose" />
        <StatCard icon={<FaClock />} label="Pending Orders" value={stats.pendingOrders} color="bg-caramel" />
        <StatCard icon={<FaCheckCircle />} label="Completed" value={stats.completedOrders} color="bg-sage" />
        <StatCard icon={<FaUsers />} label="Total Users" value={stats.totalUsers} color="bg-indigo-400" />
        <StatCard icon={<FaMoneyBillWave />} label="Total Revenue" value={`₹${stats.totalRevenue?.toLocaleString("en-IN")}`} color="bg-green-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold text-chocolate mb-4">Revenue – Last 7 Days</h3>
          {dailyRevenue.length === 0 ? (
            <p className="text-chocolate/50 text-sm text-center py-10">No revenue data yet</p>
          ) : (
            <div className="flex items-end gap-3 h-36">
              {dailyRevenue.map((d) => (
                <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-chocolate/50">₹{d.revenue}</span>
                  <div
                    className="w-full bg-rose rounded-t-lg transition-all duration-500"
                    style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: "4px" }}
                  />
                  <span className="text-xs text-chocolate/40">{d._id?.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <h3 className="font-semibold text-chocolate mb-4">Order Status Breakdown</h3>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s._id} className="flex items-center gap-3">
                <span className="text-xs text-chocolate/60 w-32">{s._id}</span>
                <div className="flex-1 bg-blush rounded-full h-2">
                  <div
                    className="bg-rose h-2 rounded-full"
                    style={{ width: `${Math.min((s.count / (stats.todaysOrders || 1)) * 100 + 20, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-chocolate w-8 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Cakes */}
      <div className="bg-white rounded-2xl p-5 shadow-soft">
        <h3 className="font-semibold text-chocolate mb-4">Popular Cakes</h3>
        {popularCakes.length === 0 ? (
          <p className="text-chocolate/50 text-sm">No cakes yet</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularCakes.map((c, i) => (
              <div key={c._id} className="text-center">
                <div className="w-full h-20 rounded-xl bg-blush/40 flex items-center justify-center text-3xl mb-2">
                  🎂
                </div>
                <p className="text-sm font-semibold text-chocolate truncate">{c.name}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-caramel">
                  <FaStar /><span>{c.rating}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
