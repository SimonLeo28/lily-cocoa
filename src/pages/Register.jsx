import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

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

  const inputClass =
    "w-full mt-1 px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-cream to-blush/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-center text-chocolate/60 mb-6">Join us for the sweetest experience</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input className={inputClass} {...register("firstName", { required: "Required" })} />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input className={inputClass} {...register("lastName", { required: "Required" })} />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" className={inputClass} {...register("email", { required: "Required" })} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input className={inputClass} {...register("phone", { required: "Required" })} />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className={inputClass}
                {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                className={inputClass}
                {...register("confirmPassword", {
                  required: "Required",
                  validate: (val) => val === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-chocolate/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-rose font-medium hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
