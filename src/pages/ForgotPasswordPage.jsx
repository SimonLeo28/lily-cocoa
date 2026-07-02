import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../api/authApi.js";

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await forgotPasswordApi({ email });
      setSent(true);
      toast.success("Check your email for reset instructions");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-blush to-rose/20 px-4">
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-soft p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="font-display text-3xl font-bold text-chocolate">Forgot Password?</h1>
          <p className="text-chocolate/60 mt-1">Enter your email and we'll send reset instructions.</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <p className="text-chocolate/70 mb-6">
              If an account exists for that email, you'll receive reset instructions shortly.
            </p>
            <Link to="/login" className="btn-primary">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-chocolate mb-1">Email Address</label>
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-400" : "border-blush"} bg-cream/50 outline-none focus:border-rose`}
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-60">
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-chocolate/60 mt-6">
          <Link to="/login" className="text-rose hover:underline">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
