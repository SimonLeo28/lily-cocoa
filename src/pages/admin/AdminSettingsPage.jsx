import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePasswordApi } from "../../api/authApi.js";
import { useForm } from "react-hook-form";

const AdminSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onChangePw = async (data) => {
    if (data.newPassword !== data.confirmNew) { toast.error("Passwords don't match"); return; }
    try {
      await changePasswordApi({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success("Password updated");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm";

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl font-bold text-chocolate mb-6">Settings</h1>

      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <h3 className="font-semibold text-chocolate mb-4">Admin Account</h3>
        <div className="space-y-2 text-sm text-chocolate/70">
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> <span className="capitalize font-semibold text-rose">{user?.role}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <h3 className="font-semibold text-chocolate mb-4">Change Password</h3>
        <form onSubmit={handleSubmit(onChangePw)} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Current Password</label>
            <input type="password" className={inputCls} {...register("currentPassword", { required: true })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">New Password</label>
            <input type="password" className={inputCls} {...register("newPassword", { required: true, minLength: { value: 6, message: "Min 6 chars" } })} />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Confirm New Password</label>
            <input type="password" className={inputCls} {...register("confirmNew", { required: true })} />
          </div>
          <button type="submit" className="btn-primary !px-6 !py-2 text-sm">Update Password</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h3 className="font-semibold text-chocolate mb-4">Session</h3>
        <button
          onClick={() => { logout(); navigate("/admin/login"); }}
          className="btn-secondary !px-6 !py-2 text-sm text-red-500 border-red-300 hover:bg-red-50"
        >
          Logout from Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
