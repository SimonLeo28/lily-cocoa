import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      const from = location.state?.from?.pathname || (user.role === "admin" ? "/admin/dashboard" : "/");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-blush to-rose/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍰</div>
          <h1 className="font-display text-3xl font-bold text-chocolate">Sweet Crumbs</h1>
          <p className="text-chocolate/60 mt-1">Welcome back, sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-chocolate mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email ? "border-red-400" : "border-blush"
              } bg-cream/50 outline-none focus:border-rose transition`}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-chocolate mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.password ? "border-red-400" : "border-blush"
                } bg-cream/50 outline-none focus:border-rose transition pr-11`}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate/50"
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-rose hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-base disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-chocolate/60 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-rose font-semibold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
