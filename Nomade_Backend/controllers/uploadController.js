import { updateGuideProfile, getGuideCompleteProfile } from "../models/guideModel.js";
import { updateTouristProfileInDB, getTouristById } from "../models/touristModel.js";

/**
 * Get full URL for an image path
 */
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  // Remove any duplicate slashes
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Upload profile image for a guide
 * PUT /api/guides/:id/upload-image
 */
export const uploadGuideImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: "No image file provided. Please select an image to upload." 
      });
    }

    // Get the file path from multer
    const profileImage = req.file.path;

    // Check if guide exists
    const guide = await getGuideCompleteProfile(id);
    if (!guide) {
      return res.status(404).json({ 
        error: "Guide not found" 
      });
    }

    // Update guide with new profile image
    await updateGuideProfile(id, {
      ...guide,
      Profile_Image: profileImage,
    });

    // Get the full URL for the image
    const fullImageUrl = getFullImageUrl(profileImage);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      Profile_Image: fullImageUrl,
    });
  } catch (err) {
    console.error("Error uploading guide profile image:", err);
    res.status(500).json({ 
      error: "Failed to upload profile image",
      message: err.message 
    });
  }
};

/**
 * Upload profile image for a tourist
 * PUT /api/tourist/:id/upload-image
 */
export const uploadTouristImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: "No image file provided. Please select an image to upload." 
      });
    }

    // Get the file path from multer
    const profileImage = req.file.path;

    // Check if tourist exists
    const tourist = await getTouristById(id);
    if (!tourist) {
      return res.status(404).json({ 
        error: "Tourist not found" 
      });
    }

    // Update tourist with new profile image
    await updateTouristProfileInDB(
      id, 
      tourist.FName, 
      tourist.LName, 
      tourist.Email, 
      profileImage
    );

    // Get the full URL for the image
    const fullImageUrl = getFullImageUrl(profileImage);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      Profile_Image: fullImageUrl,
    });
  } catch (err) {
    console.error("Error uploading tourist profile image:", err);
    res.status(500).json({ 
      error: "Failed to upload profile image",
      message: err.message 
    });
  }
};

/**
 * Delete profile image for a guide
 * DELETE /api/guides/:id/delete-image
 */
export const deleteGuideImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if guide exists
    const guide = await getGuideCompleteProfile(id);
    if (!guide) {
      return res.status(404).json({ 
        error: "Guide not found" 
      });
    }

    // Update guide with null profile image
    await updateGuideProfile(id, {
      ...guide,
      Profile_Image: null,
    });

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting guide profile image:", err);
    res.status(500).json({ 
      error: "Failed to delete profile image",
      message: err.message 
    });
  }
};

/**
 * Delete profile image for a tourist
 * DELETE /api/tourist/:id/delete-image
 */
export const deleteTouristImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tourist exists
    const tourist = await getTouristById(id);
    if (!tourist) {
      return res.status(404).json({ 
        error: "Tourist not found" 
      });
    }

    // Update tourist with null profile image
    await updateTouristProfileInDB(
      id, 
      tourist.FName, 
      tourist.LName, 
      tourist.Email, 
      null
    );

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting tourist profile image:", err);
    res.status(500).json({ 
      error: "Failed to delete profile image",
      message: err.message 
    });
  }
};