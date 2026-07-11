import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findTouristByEmail,
  getTouristById,
  updateTouristProfileInDB,
} from "../models/touristModel.js";

// check if email if valid
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

/*************************** Get Tourist Profile ***************************/
export const getTouristProfile = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid User ID." });
  }

  try {
    const tourist = await getTouristById(id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist profile not found." });
    }

    res.status(200).json({ data: tourist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/***************************  Update Tourist Profile ***************************/
export const updateTouristProfile = async (req, res) => {
  const { id } = req.params;
  const { FName, LName, Email } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Invalid guide ID",
    });
  }

  // Profile Validation
  if (!FName || FName.trim() === "" || !LName || LName.trim() === "") {
    return res.status(400).json({ error: "Names cannot be empty." });
  }
  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  try {
    const existingEmailUser = await findTouristByEmail(Email);
    if (existingEmailUser && existingEmailUser.User_ID !== req.user.id) {
      return res
        .status(400)
        .json({ error: "This email is already in use by another account." });
    }

    await updateTouristProfileInDB(id, FName, LName, Email);

    const updatedTourist = await getTouristById(id);

    res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedTourist,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
