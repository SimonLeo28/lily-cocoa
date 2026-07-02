import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      if (user.role !== "admin") {
        toast.error("Not an admin account");
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chocolate px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="font-display text-3xl font-bold text-chocolate">Admin Login</h1>
          <p className="text-chocolate/60 text-sm mt-1">Sweet Crumbs Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-chocolate mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm"
              placeholder="admin@cakeshop.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-chocolate mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm"
              placeholder="••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In to Admin"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
