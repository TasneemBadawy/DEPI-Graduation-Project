import apiClient from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function uploadProfileImage(file, userId, role) {
  const formData = new FormData();
  formData.append("Profile_Image", file);

  try {
    const endpoint = role === "guide" 
      ? `/api/guides/${userId}/upload-image`
      : `/api/tourist/${userId}/upload-image`;
    
    const response = await apiClient.put(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

export function getProfileImageUrl(imagePath) {
  if (!imagePath) return null;
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) return imagePath;
  // If it starts with uploads/, add the base URL
  if (imagePath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${imagePath}`;
  }
  // Otherwise, assume it's a relative path
  return `${API_BASE_URL}/${imagePath}`;
}

export function getInitialsAvatar(name, size = 128) {
  if (!name) return "/default-avatar.jpg";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff&size=${size}`;
}

export function validateImageFile(file) {
  if (!file) return { valid: false, error: "No file selected" };
  
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: "Please select an image file" };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "Image size must be less than 5MB" };
  }
  
  return { valid: true, error: null };
}

export function getDefaultAvatar() {
  return "/default-avatar.jpg";
}