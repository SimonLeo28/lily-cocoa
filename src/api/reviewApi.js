import api from "./axios.js";

export const getCakeReviewsApi = (cakeId) => api.get(`/reviews/cake/${cakeId}`);
export const createReviewApi = (data) => api.post("/reviews", data);
export const deleteReviewApi = (id) => api.delete(`/reviews/${id}`);
export const getAllReviewsApi = () => api.get("/reviews/admin/all");
