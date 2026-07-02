import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../api/authApi.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await forgotPasswordApi({ email });
      toast.success(data.message);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-br from-cream to-blush/30">
      <div className="card w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-chocolate/60 mb-6 text-sm">
          Enter your email and we'll send you a reset link (placeholder feature).
        </p>
        {sent ? (
          <p className="text-sage">Check your inbox for further instructions.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose"
            />
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
        <Link to="/login" className="block mt-6 text-sm text-rose hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
