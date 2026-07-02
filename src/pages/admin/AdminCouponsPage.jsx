import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getCouponsApi, createCouponApi, deleteCouponApi, updateCouponApi } from "../../api/couponApi.js";
import Loader from "../../components/common/Loader.jsx";

const inputCls = "w-full px-3 py-2 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm";

const EMPTY = { code: "", discountPercent: "", maxDiscount: "", minOrderValue: "", expiresAt: "", isActive: true };

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await getCouponsApi();
    setCoupons(data.coupons);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountPercent: Number(form.discountPercent),
        maxDiscount: Number(form.maxDiscount) || 0,
        minOrderValue: Number(form.minOrderValue) || 0,
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive,
      };
      await createCouponApi(payload);
      toast.success("Coupon created");
      setShowForm(false);
      setForm(EMPTY);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await deleteCouponApi(id);
    toast.success("Coupon deleted");
    fetchCoupons();
  };

  const toggleActive = async (coupon) => {
    await updateCouponApi(coupon._id, { isActive: !coupon.isActive });
    fetchCoupons();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold text-chocolate">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2">
          <FaPlus /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-chocolate">Create Coupon</h2>
              <button onClick={() => setShowForm(false)} className="text-chocolate/50 hover:text-rose text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Coupon Code *</label>
                <input
                  required
                  className={inputCls}
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Discount % *</label>
                  <input type="number" required min="1" max="100" className={inputCls} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Max Discount (₹)</label>
                  <input type="number" className={inputCls} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Min Order (₹)</label>
                  <input type="number" className={inputCls} value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} placeholder="500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Expires On</label>
                  <input type="date" className={inputCls} value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary !px-6 !py-2 text-sm">{submitting ? "Saving…" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !px-6 !py-2 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="grid gap-4">
          {coupons.length === 0 ? (
            <div className="text-center py-16 text-chocolate/50">No coupons yet. Create one!</div>
          ) : coupons.map((c) => (
            <div key={c._id} className="bg-white rounded-2xl shadow-soft p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-rose text-lg font-display">{c.code}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-chocolate/70">
                  <strong>{c.discountPercent}% off</strong>
                  {c.maxDiscount > 0 && ` (max ₹${c.maxDiscount})`}
                  {c.minOrderValue > 0 && ` • Min order ₹${c.minOrderValue}`}
                  {c.expiresAt && ` • Expires ${new Date(c.expiresAt).toLocaleDateString("en-IN")}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleActive(c)} className={`text-xl ${c.isActive ? "text-green-500" : "text-chocolate/30"}`}>
                  {c.isActive ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button onClick={() => handleDelete(c._id)} className="text-chocolate/30 hover:text-red-500"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
