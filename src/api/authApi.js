import api from "./axios.js";

export const registerApi = (data) => api.post("/auth/register", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const getProfileApi = () => api.get("/auth/profile");
export const updateProfileApi = (data) => api.put("/auth/profile", data);
export const changePasswordApi = (data) => api.put("/auth/change-password", data);
export const forgotPasswordApi = (data) => api.post("/auth/forgot-password", data);
