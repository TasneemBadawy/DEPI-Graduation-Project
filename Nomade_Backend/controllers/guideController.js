import bcrypt from "bcrypt";
import {
  getAllGuides,
  getGuideCompleteProfile,
  updateGuideProfile,
  updateGuidePhoneNumbers,
  updateGuideSpecializations,
  updateGuideCertificates,
  updateGuideLanguages,
  deleteGuideById,
  searchAndFilterGuides,
} from "../models/guideModel.js";
import { generateToken } from "../utils/generateToken.js";

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/${imagePath}`;
};

//  Get all guides
export const getGuides = async (req, res) => {
  try {
    const guides = await getAllGuides();
    
    // Add full image URLs
    const guidesWithImages = guides.map(guide => ({
      ...guide,
      Profile_Image: getFullImageUrl(guide.Profile_Image)
    }));
    
    res.status(200).json({
      count: guidesWithImages.length,
      data: guidesWithImages,
    });
  } catch (err) {
    console.error("Error fetching guides:", err);
    res.status(500).json({
      error: "Failed to retrieve guides",
      message: err.message,
    });
  }
};

//  Get single guide
export const getGuide = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Invalid guide ID",
    });
  }

  try {
    const guide = await getGuideCompleteProfile(id);

    if (!guide) {
      return res.status(404).json({
        error: "Guide not found",
      });
    }

    // Add full image URL
    const guideWithImage = {
      ...guide,
      Profile_Image: getFullImageUrl(guide.Profile_Image)
    };

    res.status(200).json({
      data: guideWithImage,
    });
  } catch (err) {
    console.error("Error fetching guide:", err);
    res.status(500).json({
      error: "Failed to retrieve guide",
      message: err.message,
    });
  }
};

// Update guide profile
export const updateGuide = async (req, res) => {
  const { id } = req.params;
  const {
    FName,
    LName,
    Email,
    Country,
    About,
    FaceBook,
    Linkedin,
    Instagram,
    phoneNumbers,
    specializations,
    certificates,
    languages,
  } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Invalid guide ID",
    });
  }

  // Validation
  const errors = [];
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateSocialMediaUrl = (url) => {
    if (!url || url === "") return true;
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
    return urlRegex.test(url);
  };
  
  if (Email && !validateEmail(Email)) errors.push("Valid email is required");
  if (FaceBook && !validateSocialMediaUrl(FaceBook))
    errors.push("Invalid Facebook URL");
  if (Linkedin && !validateSocialMediaUrl(Linkedin))
    errors.push("Invalid LinkedIn URL");
  if (Instagram && !validateSocialMediaUrl(Instagram))
    errors.push("Invalid Instagram URL");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if guide exists
    const existingGuide = await getGuideCompleteProfile(id);
    if (!existingGuide) {
      return res.status(404).json({
        error: "Guide not found",
      });
    }

    // Update main profile
    const updateData = {
      FName: FName || existingGuide.FName,
      LName: LName || existingGuide.LName,
      Email: Email || existingGuide.Email,
      Country: Country !== undefined ? Country : existingGuide.Country,
      About: About !== undefined ? About : existingGuide.About,
      FaceBook: FaceBook !== undefined ? FaceBook : existingGuide.FaceBook,
      Linkedin: Linkedin !== undefined ? Linkedin : existingGuide.Linkedin,
      Instagram: Instagram !== undefined ? Instagram : existingGuide.Instagram,
    };

    await updateGuideProfile(id, updateData);

    // Update multivalued attributes if provided
    if (phoneNumbers !== undefined) {
      await updateGuidePhoneNumbers(id, phoneNumbers);
    }
    if (specializations !== undefined) {
      await updateGuideSpecializations(id, specializations);
    }
    if (certificates !== undefined) {
      await updateGuideCertificates(id, certificates);
    }
    if (languages !== undefined) {
      await updateGuideLanguages(id, languages);
    }

    const updatedGuide = await getGuideCompleteProfile(id);
    
    // Add full image URL
    const guideWithImage = {
      ...updatedGuide,
      Profile_Image: getFullImageUrl(updatedGuide.Profile_Image)
    };

    res.status(200).json({
      message: "Guide profile updated successfully",
      data: guideWithImage,
    });
  } catch (err) {
    console.error("Error updating guide:", err);
    res.status(500).json({
      error: "Failed to update guide",
      message: err.message,
    });
  }
};

// Delete Guide
export const deleteGuide = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteGuideById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Guide not found",
      });
    }

    res.status(200).json({
      message: "Guide deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Search Guides
export const searchGuides = async (req, res) => {
  const { Country, specialization } = req.query;

  try {
    const guides = await searchAndFilterGuides(Country, specialization);
    
    // Add full image URLs
    const guidesWithImages = guides.map(guide => ({
      ...guide,
      Profile_Image: getFullImageUrl(guide.Profile_Image)
    }));
    
    res.status(200).json(guidesWithImages);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};