import api from "./axios.js";

export const getCategoriesApi = () => api.get("/categories");
export const createCategoryApi = (formData) =>
  api.post("/categories", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateCategoryApi = (id, formData) =>
  api.put(`/categories/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteCategoryApi = (id) => api.delete(`/categories/${id}`);
