import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loginApi, registerApi, getProfileApi, updateProfileApi } from "../api/authApi.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-validate session on page reload using stored token.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("cakeshop_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getProfileApi();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("cakeshop_token");
        localStorage.removeItem("cakeshop_user");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    localStorage.setItem("cakeshop_token", data.token);
    localStorage.setItem("cakeshop_user", JSON.stringify(data.user));
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.firstName}!`);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await registerApi(formData);
    localStorage.setItem("cakeshop_token", data.token);
    localStorage.setItem("cakeshop_user", JSON.stringify(data.user));
    setUser(data.user);
    toast.success("Account created successfully!");
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("cakeshop_token");
    localStorage.removeItem("cakeshop_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = async (payload) => {
    const { data } = await updateProfileApi(payload);
    setUser(data.user);
    localStorage.setItem("cakeshop_user", JSON.stringify(data.user));
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
