import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="card p-6 space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-blush/50">
          <span className="text-sm text-chocolate/70">Account Email</span>
          <span className="font-medium">{user?.email}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-blush/50">
          <span className="text-sm text-chocolate/70">Account Type</span>
          <span className="font-medium capitalize">{user?.role}</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-chocolate/70">Member Since</span>
          <span className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <button onClick={logout} className="btn-secondary mt-6">Logout</button>
    </div>
  );
};

export default Settings;
