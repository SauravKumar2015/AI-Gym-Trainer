import apiClient from "./api";

export const aiService = {
  generateWorkout: async () => {
    const res = await apiClient.post("/ai/generate-workout");
    return res.data;
  },

  generateDiet: async () => {
    const res = await apiClient.post("/ai/generate-diet");
    return res.data;
  },

  generateExercise: async () => {
    const res = await apiClient.post("/ai/generate-exercise");
    return res.data;
  },

  generateMeal: async () => {
    const res = await apiClient.post("/ai/generate-meal");
    return res.data;
  },

  generateProgress: async () => {
    const res = await apiClient.post("/ai/generate-progress");
    return res.data;
  },

  getRecommendations: async () => {
    const res = await apiClient.get("/ai/recommendations");
    return res.data;
  },

  getHealthMetrics: async () => {
    const res = await apiClient.get("/ai/health-metrics");
    return res.data;
  },
};
