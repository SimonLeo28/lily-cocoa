import api from "./axios.js";

export const getWishlistApi = () => api.get("/wishlist");
export const addToWishlistApi = (cakeId) => api.post("/wishlist", { cakeId });
export const removeFromWishlistApi = (cakeId) => api.delete(`/wishlist/${cakeId}`);
