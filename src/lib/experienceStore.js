import apiClient from "./apiClient";
import { EXPERIENCES } from "../data/experiences";

export async function getAllExperiences() {
  try {
    console.log("Fetching experiences from API...");
    const response = await apiClient.get("/api/activities");
    console.log("Experiences API Response:", response.data);
    
    let data = response.data.data || response.data || [];
    
    // If API returns empty array or no data, use local data
    if (!Array.isArray(data) || data.length === 0) {
      console.log("No activities from API, using local data");
      return EXPERIENCES.map(exp => ({
        ...exp,
        Activity_ID: exp.slug,
        Activity_name: exp.title,
        Category: exp.tag,
        City: exp.city,
        Price: exp.price,
        Image: exp.image,
        Rating: 4.5,
        Reviews: Math.floor(Math.random() * 200) + 50,
      }));
    }
    
    // Map API data to expected format
    return data.map(item => ({
      ...item,
      slug: item.Activity_ID || item.slug || `exp-${Math.random()}`,
      title: item.Activity_name || item.title || "Experience",
      tag: item.Category || item.tag || "Activity",
      city: item.City || item.city || "Unknown",
      price: item.Price || item.price || 0,
      image: item.Image || item.image || "/default-experience.jpg",
      rating: item.Rating || item.rating || 4.5,
      reviews: item.Reviews || item.reviews || 0,
    }));
  } catch (error) {
    console.error("Error fetching experiences:", error.message);
    // Return local data as fallback
    console.log("Returning local data as fallback");
    return EXPERIENCES.map(exp => ({
      ...exp,
      Activity_ID: exp.slug,
      Activity_name: exp.title,
      Category: exp.tag,
      City: exp.city,
      Price: exp.price,
      Image: exp.image,
      Rating: 4.5,
      Reviews: Math.floor(Math.random() * 200) + 50,
    }));
  }
}

export async function getExperienceById(id) {
  try {
    const response = await apiClient.get(`/api/activities/${id}`);
    const data = response.data.data || response.data;
    return {
      ...data,
      slug: data.Activity_ID || data.slug || id,
      title: data.Activity_name || data.title,
      tag: data.Category || data.tag,
      city: data.City || data.city,
      price: data.Price || data.price,
    };
  } catch (error) {
    console.error("Error fetching experience:", error);
    // Try to find in local data
    const found = EXPERIENCES.find(e => e.slug === id);
    if (found) {
      return {
        ...found,
        Activity_ID: found.slug,
        Activity_name: found.title,
        Category: found.tag,
        City: found.city,
        Price: found.price,
        Image: found.image,
      };
    }
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