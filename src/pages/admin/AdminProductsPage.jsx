import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getCakesApi, createCakeApi, updateCakeApi, deleteCakeApi } from "../../api/cakeApi.js";
import { getCategoriesApi } from "../../api/categoryApi.js";
import Loader from "../../components/common/Loader.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
const resolveImg = (img) => img ? (img.startsWith("http") ? img : `${API_BASE}${img}`) : null;

const EMPTY = {
  name: "", description: "", ingredients: "", basePrice: "", discountPercent: 0,
  category: "", eggType: "eggless", preparationTimeHours: 4,
  flavours: "", weightOptions: "", isAvailable: true, isFeatured: false, isBestSeller: false,
};

const AdminProductsPage = () => {
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCake, setEditCake] = useState(null);
  const [formData, setFormData] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCakes = async (pg = 1) => {
    setLoading(true);
    const { data } = await getCakesApi({ page: pg, limit: 10, search });
    setCakes(data.cakes);
    setPages(data.pages);
    setPage(pg);
    setLoading(false);
  };

  useEffect(() => {
    getCategoriesApi().then(({ data }) => setCategories(data.categories));
    fetchCakes(1);
  }, [search]);

  const openAdd = () => { setEditCake(null); setFormData(EMPTY); setImages([]); setShowForm(true); };
  const openEdit = (cake) => {
    setEditCake(cake);
    setFormData({
      ...cake,
      flavours: cake.flavours?.join(", ") || "",
      weightOptions: cake.weightOptions?.map((w) => `${w.weight}:${w.price}`).join(", ") || "",
      category: cake.category?._id || cake.category,
    });
    setImages([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this cake?")) return;
    await deleteCakeApi(id);
    toast.success("Deleted");
    fetchCakes(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();

      const flavours = formData.flavours.split(",").map((s) => s.trim()).filter(Boolean);
      const weightOptions = formData.weightOptions
        ? formData.weightOptions.split(",").map((s) => {
            const [weight, price] = s.trim().split(":");
            return { weight: weight?.trim(), price: Number(price?.trim()) };
          }).filter((w) => w.weight && w.price)
        : [];

      Object.entries(formData).forEach(([k, v]) => {
        if (k !== "flavours" && k !== "weightOptions" && k !== "images" && k !== "cakeId")
          fd.append(k, v);
      });
      fd.append("flavours", JSON.stringify(flavours));
      fd.append("weightOptions", JSON.stringify(weightOptions));
      images.forEach((img) => fd.append("images", img));

      if (editCake) {
        await updateCakeApi(editCake._id, fd);
        toast.success("Cake updated");
      } else {
        await createCakeApi(fd);
        toast.success("Cake created");
      }

      setShowForm(false);
      fetchCakes(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving cake");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold text-chocolate">Products</h1>
        <button onClick={openAdd} className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2">
          <FaPlus /> Add Cake
        </button>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cakes…"
          className={`${inputCls} max-w-xs`}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-chocolate">{editCake ? "Edit Cake" : "Add New Cake"}</h2>
              <button onClick={() => setShowForm(false)} className="text-chocolate/50 hover:text-rose text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Name *</label>
                <input required className={inputCls} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Description *</label>
                <textarea rows={3} required className={`${inputCls} resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Ingredients</label>
                <textarea rows={2} className={`${inputCls} resize-none`} value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Category *</label>
                <select required className={inputCls} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Egg Type</label>
                <select className={inputCls} value={formData.eggType} onChange={(e) => setFormData({ ...formData, eggType: e.target.value })}>
                  <option value="eggless">Eggless</option>
                  <option value="egg">With Egg</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Base Price (₹) *</label>
                <input type="number" required className={inputCls} value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Discount (%)</label>
                <input type="number" min="0" max="100" className={inputCls} value={formData.discountPercent} onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Weight Options (format: 1kg:799, 0.5kg:499)</label>
                <input className={inputCls} value={formData.weightOptions} placeholder="0.5kg:499, 1kg:799, 2kg:1499" onChange={(e) => setFormData({ ...formData, weightOptions: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Flavours (comma-separated)</label>
                <input className={inputCls} value={formData.flavours} placeholder="Chocolate, Vanilla, Butterscotch" onChange={(e) => setFormData({ ...formData, flavours: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Prep Time (hours)</label>
                <input type="number" className={inputCls} value={formData.preparationTimeHours} onChange={(e) => setFormData({ ...formData, preparationTimeHours: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Upload Images</label>
                <input type="file" multiple accept="image/*" className="text-sm" onChange={(e) => setImages(Array.from(e.target.files))} />
              </div>
              <div className="sm:col-span-2 flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} /> Available
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} /> Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} /> Best Seller
                </label>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary !px-6 !py-2 text-sm">{submitting ? "Saving…" : editCake ? "Update Cake" : "Create Cake"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !px-6 !py-2 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream text-chocolate/60 font-semibold">
              <tr>
                <th className="text-left px-4 py-3">Cake</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blush">
              {cakes.map((cake) => {
                const img = resolveImg(cake.images?.[0]);
                return (
                  <tr key={cake._id} className="hover:bg-cream/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blush flex-shrink-0 overflow-hidden">
                          {img ? <img src={img} className="w-full h-full object-cover" alt="" /> : <span className="text-xl flex items-center justify-center h-full">🎂</span>}
                        </div>
                        <div>
                          <p className="font-medium text-chocolate truncate max-w-[120px]">{cake.name}</p>
                          <p className="text-xs text-chocolate/50">{cake.cakeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-chocolate/60 hidden md:table-cell">{cake.category?.name}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-rose">₹{Math.round(cake.basePrice - (cake.basePrice * cake.discountPercent) / 100)}</p>
                      {cake.discountPercent > 0 && <p className="text-xs text-chocolate/40 line-through">₹{cake.basePrice}</p>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${cake.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {cake.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => openEdit(cake)} className="text-caramel hover:text-chocolate"><FaEdit /></button>
                        <button onClick={() => handleDelete(cake._id)} className="text-chocolate/30 hover:text-red-500"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="flex justify-center gap-2 p-4">
              {Array(pages).fill(0).map((_, i) => (
                <button key={i} onClick={() => fetchCakes(i + 1)} className={`w-8 h-8 rounded-full text-xs font-medium ${page === i + 1 ? "bg-rose text-white" : "bg-cream text-chocolate"}`}>
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

export default AdminProductsPage;
