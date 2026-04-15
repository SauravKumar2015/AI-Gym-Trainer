import apiClient from "./api";

export const authService = {
  async login(email, password) {
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data; // { token }
  },

  async register(payload) {
    const { data } = await apiClient.post("/auth/register", payload);
    return data; // { id, token }
  },

  async loginWithGoogle(googleToken) {
    const { data } = await apiClient.post("/auth/google/login", {
      token: googleToken,
    });
    return data; // { token, user }
  },

  async registerWithGoogle(googleToken) {
    const { data } = await apiClient.post("/auth/google/register", {
      token: googleToken,
    });
    return data; // { token, user }
  },

  async getProfile(token) {
    const { data } = await apiClient.get("/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async updateProfile(payload, token) {
    const { data } = await apiClient.put("/users/update", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data; // { message, user, token }
  },

  async changePassword(oldPassword, newPassword) {
    const { data } = await apiClient.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
    return data;
  },

  async deleteAccount() {
    const { data } = await apiClient.delete("/users/delete");
    return data;
  },

  async forgotPassword(email) {
    const { data } = await apiClient.post("/users/forgot-password", { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await apiClient.post("/users/reset-password", {
      token,
      newPassword,
    });
    return data;
  },

  async checkHealth() {
    const { data } = await apiClient.get("/health/status");
    return data;
  },
};
