import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const InputField = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-chocolate mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border ${
      err ? "border-red-400" : "border-blush"
    } bg-cream/50 outline-none focus:border-rose transition`;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-blush to-rose/20 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft p-8 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎂</div>
          <h1 className="font-display text-3xl font-bold text-chocolate">Create Account</h1>
          <p className="text-chocolate/60 mt-1">Join the Sweet Crumbs family</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="First Name" error={errors.firstName?.message}>
              <input
                className={inputCls(errors.firstName)}
                placeholder="John"
                {...register("firstName", { required: "Required" })}
              />
            </InputField>
            <InputField label="Last Name" error={errors.lastName?.message}>
              <input
                className={inputCls(errors.lastName)}
                placeholder="Doe"
                {...register("lastName", { required: "Required" })}
              />
            </InputField>
          </div>

          <InputField label="Email" error={errors.email?.message}>
            <input
              type="email"
              className={inputCls(errors.email)}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
            />
          </InputField>

          <InputField label="Phone Number" error={errors.phone?.message}>
            <input
              className={inputCls(errors.phone)}
              placeholder="9876543210"
              {...register("phone", {
                required: "Phone is required",
                minLength: { value: 10, message: "Enter valid phone number" },
              })}
            />
          </InputField>

          <InputField label="Password" error={errors.password?.message}>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className={`${inputCls(errors.password)} pr-11`}
                placeholder="Min 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate/50"
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </InputField>

          <InputField label="Confirm Password" error={errors.confirmPassword?.message}>
            <input
              type="password"
              className={inputCls(errors.confirmPassword)}
              placeholder="••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === watch("password") || "Passwords do not match",
              })}
            />
          </InputField>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-base mt-2 disabled:opacity-60"
          >
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-chocolate/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-rose font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
