import api from "./axios.js";

export const getCakesApi = (params) => api.get("/cakes", { params });
export const getCakeByIdApi = (id) => api.get(`/cakes/${id}`);
export const createCakeApi = (formData) =>
  api.post("/cakes", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateCakeApi = (id, formData) =>
  api.put(`/cakes/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteCakeApi = (id) => api.delete(`/cakes/${id}`);
