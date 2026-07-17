import apiClient from "./apiClient";

export async function getAllExperiences() {
  try {
    console.log("Fetching experiences from API...");
    const response = await apiClient.get("/api/activities");
    console.log("Experiences API Response:", response.data);
    
    const data = response.data.data || response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching experiences:", error.message);
    return [];
  }
}

export async function getExperienceById(id) {
  try {
    const response = await apiClient.get(`/api/activities/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching experience:", error);
    return null;
  }
}

export async function createExperience(data) {
  try {
    const response = await apiClient.post("/api/activities", data);
    return response.data;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
}

export async function deleteExperience(id) {
  try {
    await apiClient.delete(`/api/activities/${id}`);
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}