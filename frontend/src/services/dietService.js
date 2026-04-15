import apiClient from "./api";

export const dietService = {
  // Diet Plans
  async getAllDiets() {
    const { data } = await apiClient.get("/diets");
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  async getDietById(id) {
    const { data } = await apiClient.get(`/diets/${id}`);
    return data;
  },

  async createDiet(payload) {
    const { data } = await apiClient.post("/diets", payload);
    return data;
  },

  async deleteDiet(id) {
    const { data } = await apiClient.delete(`/diets/${id}`);
    return data;
  },

  // Meals
  async getAllMeals() {
    const { data } = await apiClient.get("/meals");
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  async deleteMeal(id) {
    const { data } = await apiClient.delete(`/meals/${id}`);
    return data;
  },

  async createMeal(payload) {
    const { data } = await apiClient.post("/meals", payload);
    return data;
  },

  // Progress
  async logProgress(payload) {
    const { data } = await apiClient.post("/progress/log", payload);
    return data;
  },

  async getProgressHistory(userId) {
    const { data } = await apiClient.get(`/progress/history?userId=${userId}`);
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  // AI
  async generateWorkout() {
    const { data } = await apiClient.post("/ai/generate-workout", {});
    return data;
  },

  async generateDiet() {
    const { data } = await apiClient.post("/ai/generate-diet", {});
    return data;
  },

  async getRecommendations(userId) {
    const { data } = await apiClient.get(`/ai/recommendations/${userId}`);
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  async getHealthMetrics() {
    const { data } = await apiClient.get("/ai/health-metrics");
    return data;
  },
};
