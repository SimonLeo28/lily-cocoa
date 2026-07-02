import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from "../../api/categoryApi.js";
import Loader from "../../components/common/Loader.jsx";

const inputCls = "w-full px-3 py-2 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await getCategoriesApi();
    setCategories(data.categories);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditCat(null); setForm({ name: "", description: "" }); setImage(null); setShowForm(true); };
  const openEdit = (cat) => { setEditCat(cat); setForm({ name: cat.name, description: cat.description }); setImage(null); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      if (editCat) {
        await updateCategoryApi(editCat._id, fd);
        toast.success("Category updated");
      } else {
        await createCategoryApi(fd);
        toast.success("Category created");
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategoryApi(id);
      toast.success("Deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-bold text-chocolate">Categories</h1>
        <button onClick={openAdd} className="btn-primary !px-5 !py-2 text-sm flex items-center gap-2">
          <FaPlus /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-chocolate">{editCat ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowForm(false)} className="text-chocolate/50 hover:text-rose text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Name *</label>
                <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Description</label>
                <textarea rows={3} className={`${inputCls} resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Image</label>
                <input type="file" accept="image/*" className="text-sm" onChange={(e) => setImage(e.target.files[0])} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary !px-6 !py-2 text-sm">
                  {submitting ? "Saving…" : editCat ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !px-6 !py-2 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl shadow-soft p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-chocolate">{cat.name}</p>
                <p className="text-xs text-chocolate/50 mt-1">{cat.slug}</p>
                {cat.description && <p className="text-xs text-chocolate/60 mt-1 line-clamp-2">{cat.description}</p>}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={() => openEdit(cat)} className="text-caramel hover:text-chocolate"><FaEdit /></button>
                <button onClick={() => handleDelete(cat._id)} className="text-chocolate/30 hover:text-red-500"><FaTrash /></button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-3 text-center py-16 text-chocolate/50">No categories yet. Add one!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
