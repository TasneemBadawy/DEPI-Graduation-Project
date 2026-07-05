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

//  Get all guides
export const getGuides = async (req, res) => {
  try {
    const guides = await getAllGuides();
    res.status(200).json({
      count: guides.length,
      data: guides,
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

    res.status(200).json({
      data: guide,
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

    res.status(200).json({
      message: "Guide profile updated successfully",
      data: updatedGuide,
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
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
