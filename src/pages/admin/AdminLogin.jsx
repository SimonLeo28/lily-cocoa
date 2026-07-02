import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      if (user.role !== "admin") {
        toast.error("This account does not have admin access");
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
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-1">Admin Login</h1>
        <p className="text-center text-chocolate/60 mb-6 text-sm">Sweet Crumbs Management Panel</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose"
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose"
            {...register("password", { required: true })}
          />
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link to="/login" className="block text-center text-sm text-rose mt-6 hover:underline">
          Back to customer login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
