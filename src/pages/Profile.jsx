import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { changePasswordApi } from "../api/authApi.js";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone },
  });
  const { register: registerPw, handleSubmit: handlePwSubmit, reset: resetPw } = useForm();
  const [saving, setSaving] = useState(false);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data) => {
    try {
      await changePasswordApi(data);
      toast.success("Password changed");
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Edit Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input className={inputClass} {...register("firstName")} />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input className={inputClass} {...register("lastName")} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className={inputClass} value={user?.email} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className={inputClass} {...register("phone")} />
          </div>
          <button disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePwSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <input type="password" className={inputClass} {...registerPw("currentPassword", { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input type="password" className={inputClass} {...registerPw("newPassword", { required: true, minLength: 6 })} />
          </div>
          <button className="btn-secondary">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
