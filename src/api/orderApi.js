import api from "./axios.js";

export const createOrderApi = (data) => api.post("/orders", data);
export const getMyOrdersApi = () => api.get("/orders");
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);
export const getAllOrdersApi = (params) => api.get("/orders/admin/all", { params });
export const updateOrderStatusApi = (data) => api.put("/orders/status", data);
