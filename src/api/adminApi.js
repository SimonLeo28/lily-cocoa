import api from "./axios.js";

export const getDashboardApi = () => api.get("/admin/dashboard");
export const getAllUsersApi = (params) => api.get("/admin/users", { params });
export const getUserOrderHistoryApi = (id) => api.get(`/admin/users/${id}/orders`);
export const toggleBlockUserApi = (id) => api.put(`/admin/users/${id}/block`);
export const deleteUserApi = (id) => api.delete(`/admin/users/${id}`);
