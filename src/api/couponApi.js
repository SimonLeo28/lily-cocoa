import api from "./axios.js";

export const validateCouponApi = (data) => api.post("/coupons/validate", data);
export const getCouponsApi = () => api.get("/coupons");
export const createCouponApi = (data) => api.post("/coupons", data);
export const updateCouponApi = (id, data) => api.put(`/coupons/${id}`, data);
export const deleteCouponApi = (id) => api.delete(`/coupons/${id}`);
