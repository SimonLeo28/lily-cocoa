import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { getAddressesApi, addAddressApi, deleteAddressApi } from "../api/addressApi.js";
import Loader from "../components/common/Loader.jsx";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    getAddressesApi()
      .then((res) => setAddresses(res.data.addresses))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSubmit = async (data) => {
    try {
      await addAddressApi(data);
      toast.success("Address added");
      reset();
      setShowForm(false);
      load();
    } catch (err) {
      toast.error("Could not add address");
    }
  };

  const handleDelete = async (id) => {
    await deleteAddressApi(id);
    toast.success("Address removed");
    load();
  };

  if (loading) return <Loader fullScreen />;

  const inputClass = "w-full px-4 py-3 rounded-xl border border-blush focus:outline-none focus:ring-2 focus:ring-rose";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 !px-4 !py-2 text-sm">
          <FaPlus /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Label (e.g. Home)" className={inputClass} {...register("label")} />
            <input placeholder="Full Name" className={inputClass} {...register("fullName", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Phone" className={inputClass} {...register("phone", { required: true })} />
            <input placeholder="Alternate Phone" className={inputClass} {...register("alternatePhone")} />
          </div>
          <textarea placeholder="Address" className={inputClass} {...register("addressLine", { required: true })} />
          <div className="grid grid-cols-3 gap-4">
            <input placeholder="City" className={inputClass} {...register("city", { required: true })} />
            <input placeholder="State" className={inputClass} {...register("state", { required: true })} />
            <input placeholder="Pincode" className={inputClass} {...register("pincode", { required: true })} />
          </div>
          <input placeholder="Landmark" className={inputClass} {...register("landmark")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isDefault")} /> Set as default
          </label>
          <button className="btn-primary">Save Address</button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.length === 0 && <p className="text-chocolate/60">No saved addresses yet.</p>}
        {addresses.map((addr) => (
          <div key={addr._id} className="card p-5 flex justify-between items-start">
            <div>
              <p className="font-semibold">{addr.label} {addr.isDefault && <span className="text-xs text-rose">(Default)</span>}</p>
              <p className="text-sm text-chocolate/60">{addr.fullName} • {addr.phone}</p>
              <p className="text-sm text-chocolate/60">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
            <button onClick={() => handleDelete(addr._id)} className="text-chocolate/40 hover:text-red-500">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
