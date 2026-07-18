import { updateGuideProfile, getGuideCompleteProfile } from "../models/guideModel.js";
import { updateTouristProfileInDB, getTouristById } from "../models/touristModel.js";

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/${imagePath}`;
};

// Guide profile image upload
export const uploadGuideImage = async (req, res) => {
  try {
    const { id } = req.params;
    const profileImage = req.file ? req.file.path : null;
    
    if (!profileImage) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const guide = await getGuideCompleteProfile(id);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    await updateGuideProfile(id, {
      ...guide,
      Profile_Image: profileImage,
    });

    const fullImageUrl = getFullImageUrl(profileImage);

    res.status(200).json({
      message: "Profile image updated successfully",
      Profile_Image: fullImageUrl,
    });
  } catch (err) {
    console.error("Error uploading guide profile image:", err);
    res.status(500).json({ error: err.message });
  }
};

// Tourist profile image upload
export const uploadTouristImage = async (req, res) => {
  try {
    const { id } = req.params;
    const profileImage = req.file ? req.file.path : null;
    
    if (!profileImage) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const tourist = await getTouristById(id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    await updateTouristProfileInDB(id, tourist.FName, tourist.LName, tourist.Email, profileImage);

    const fullImageUrl = getFullImageUrl(profileImage);

    res.status(200).json({
      message: "Profile image updated successfully",
      Profile_Image: fullImageUrl,
    });
  } catch (err) {
    console.error("Error uploading tourist profile image:", err);
    res.status(500).json({ error: err.message });
  }
};