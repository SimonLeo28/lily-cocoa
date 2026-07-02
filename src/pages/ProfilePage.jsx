import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaUser, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { changePasswordApi } from "../api/authApi.js";
import {
  getAddressesApi, addAddressApi, deleteAddressApi, updateAddressApi,
} from "../api/addressApi.js";

const InputCls = "w-full px-4 py-3 rounded-xl border border-blush bg-cream/50 outline-none focus:border-rose text-sm";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const { register, handleSubmit, reset } = useForm({ defaultValues: { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone } });
  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors } } = useForm();
  const { register: regAddr, handleSubmit: handleAddr, reset: resetAddr } = useForm();

  useEffect(() => {
    reset({ firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone });
    getAddressesApi().then(({ data }) => setAddresses(data.addresses)).catch(() => {});
  }, [user]);

  const onProfileSave = async (data) => {
    setSaving(true);
    try {
      await updateUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const onChangePw = async (data) => {
    if (data.newPassword !== data.confirmNew) { toast.error("Passwords do not match"); return; }
    setChangingPw(true);
    try {
      await changePasswordApi({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success("Password changed"); resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setChangingPw(false);
    }
  };

  const onAddAddress = async (data) => {
    try {
      const { data: res } = await addAddressApi(data);
      setAddresses(res.addresses);
      setShowAddAddr(false); resetAddr();
      toast.success("Address added");
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const onDeleteAddress = async (id) => {
    const { data } = await deleteAddressApi(id);
    setAddresses(data.addresses);
    toast.success("Address removed");
  };

  const setDefault = async (addr) => {
    const { data } = await updateAddressApi(addr._id, { ...addr.toObject?.() || addr, isDefault: true });
    setAddresses(data.addresses);
    toast.success("Default address updated");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <h1 className="font-display text-4xl font-bold text-chocolate">My Profile</h1>

      {/* Avatar / basic info */}
      <div className="card p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-rose flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-chocolate">{user?.firstName} {user?.lastName}</h2>
            <p className="text-chocolate/60 text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onProfileSave)} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">First Name</label>
            <input className={InputCls} {...register("firstName")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Last Name</label>
            <input className={InputCls} {...register("lastName")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Phone</label>
            <input className={InputCls} {...register("phone")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Email (read-only)</label>
            <input className={`${InputCls} opacity-60`} value={user?.email || ""} readOnly />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary !px-6 !py-2 text-sm">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="font-semibold text-chocolate mb-4">Change Password</h3>
        <form onSubmit={handlePw(onChangePw)} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Current Password</label>
            <input type="password" className={InputCls} {...regPw("currentPassword", { required: true })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">New Password</label>
            <input type="password" className={InputCls} {...regPw("newPassword", { required: true, minLength: 6 })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-chocolate/60 mb-1 block">Confirm New Password</label>
            <input type="password" className={InputCls} {...regPw("confirmNew", { required: true })} />
          </div>
          <button type="submit" disabled={changingPw} className="btn-secondary !px-6 !py-2 text-sm">
            {changingPw ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Addresses */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-chocolate">Saved Addresses</h3>
          <button onClick={() => setShowAddAddr(!showAddAddr)} className="flex items-center gap-2 text-sm btn-primary !px-4 !py-2">
            <FaPlus /> Add
          </button>
        </div>

        {showAddAddr && (
          <form onSubmit={handleAddr(onAddAddress)} className="bg-blush/30 rounded-2xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
            <input required placeholder="Full Name" className={InputCls} {...regAddr("fullName")} />
            <input required placeholder="Phone" className={InputCls} {...regAddr("phone")} />
            <input required placeholder="Address Line" className={`${InputCls} sm:col-span-2`} {...regAddr("addressLine")} />
            <input required placeholder="City" className={InputCls} {...regAddr("city")} />
            <input required placeholder="State" className={InputCls} {...regAddr("state")} />
            <input required placeholder="Pincode" className={InputCls} {...regAddr("pincode")} />
            <input placeholder="Landmark" className={InputCls} {...regAddr("landmark")} />
            <input placeholder="Label (Home, Office…)" className={InputCls} {...regAddr("label")} defaultValue="Home" />
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary !px-5 !py-2 text-sm">Save Address</button>
              <button type="button" onClick={() => setShowAddAddr(false)} className="btn-secondary !px-5 !py-2 text-sm">Cancel</button>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-chocolate/50 text-sm">No saved addresses yet.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className={`border rounded-2xl p-4 flex justify-between items-start gap-3 ${addr.isDefault ? "border-rose bg-rose/5" : "border-blush"}`}>
                <div className="text-sm text-chocolate/70">
                  <p className="font-semibold text-chocolate">{addr.fullName} <span className="text-xs bg-blush px-2 py-0.5 rounded-full ml-1">{addr.label}</span>{addr.isDefault && <span className="text-xs bg-rose/20 text-rose px-2 py-0.5 rounded-full ml-1">Default</span>}</p>
                  <p>{addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}</p>
                  <p>{addr.phone}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr)} title="Set Default" className="text-caramel hover:text-rose"><FaCheck /></button>
                  )}
                  <button onClick={() => onDeleteAddress(addr._id)} className="text-chocolate/30 hover:text-red-500"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
