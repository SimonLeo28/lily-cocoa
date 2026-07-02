import api from "./axios.js";

export const getCartApi = () => api.get("/cart");
export const addToCartApi = (data) => api.post("/cart", data);
export const updateCartItemApi = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const removeCartItemApi = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCartApi = () => api.delete("/cart");
