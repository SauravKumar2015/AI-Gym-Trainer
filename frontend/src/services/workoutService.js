import apiClient from "./api";

export const workoutService = {
  async getAll() {
    const { data } = await apiClient.get("/workouts");
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  async getById(id) {
    const { data } = await apiClient.get(`/workouts/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await apiClient.post("/workouts", payload);
    return data;
  },

  // Exercises
  async getAllExercises() {
    const { data } = await apiClient.get("/exercises");
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  async createExercise(payload) {
    const { data } = await apiClient.post("/exercises", payload);
    return data;
  },

  async deleteExercise(id) {
    const { data } = await apiClient.delete(`/exercises/${id}`);
    return data;
  },

  async deleteWorkout(id) {
    const { data } = await apiClient.delete(`/workouts/${id}`);
    return data;
  },

  // Workout Logs
  async addLog(payload) {
    const { data } = await apiClient.post("/workout-log/add", payload);
    return data;
  },

  async getUserLogs(userId) {
    const { data } = await apiClient.get(`/workout-log/user/${userId}`);
    return Array.isArray(data) ? data : data ? [data] : [];
  },
};
