import bcrypt from "bcrypt";
import { findTouristByEmail, createTourist } from "../models/touristModel.js";
import { findGuideByEmail, createGuide } from "../models/guideModel.js";
import { generateToken } from "../utils/generateToken.js";

/******************************Tourist*******************************************/
// Validations
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateSocialMediaUrl = (url) => {
  if (!url || url === "") return true;
  const urlRegex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
  return urlRegex.test(url);
};
/***************************Register Tourist**************************/
export const registerTourist = async (req, res) => {
  const { FName, LName, Email, Password } = req.body;

  const Profile_Image = req.file
    ? req.file.path
    : null;

  // Validation
  if (!FName || FName.trim() === "" || !LName || LName.trim() === "") {
    return res
      .status(400)
      .json({ error: "First name and Last name are required." });
  }
  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!Password || Password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const existedUser = await findTouristByEmail(Email);
    if (existedUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const hashPassword = await bcrypt.hash(Password, 10);
    await createTourist(FName, LName, Email, hashPassword , Profile_Image);

    res.status(201).json({ 
      message: "Tourist registered successfully.",
       Profile_Image
       });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*************************** Login Tourist ***************************/
export const logInTourist = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({
      error: "Valid email is required",
    });
  }

  if (!Password) {
    return res.status(400).json({
      error: "Password is required",
    });
  }

  try {
    const tourist = await findTouristByEmail(Email);

    if (!tourist) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(Password, tourist.Password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(Email);
    delete tourist.Password;

    res.status(200).json({
      message: "Logged in successfully",
      token,
      tourist,
    });
  } catch (err) {
    console.error("Tourist login error:", err);
    res.status(500).json({
      error: "Failed to login",
      message: err.message,
    });
  }
};

/******************************Guide********************************************/
/***************************Register Guide**********************************/

// Register a new guide
export const registerGuide = async (req, res) => {
  const {
    FName,
    LName,
    Email,
    Password,
    Country,
    About,
    FaceBook,
    Linkedin,
    Instagram,
    phoneNumbers = [],
    specializations = [],
    certificates = [],
    languages = [],
  } = req.body;

   const Profile_Image = req.file
    ? req.file.path
    : null;

  // Validation
  const errors = [];

  if (!FName || FName.trim() === "") errors.push("First name is required");
  if (!LName || LName.trim() === "") errors.push("Last name is required");
  if (!Email || !validateEmail(Email)) errors.push("Valid email is required");
  if (!Password || !validatePassword(Password))
    errors.push("Password must be at least 6 characters");
  if (Country && Country.length > 50) errors.push("Country name too long");
  if (About && About.length > 65535) errors.push("About section too long");
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
    // Check if guide already exists
    const existingGuide = await findGuideByEmail(Email);
    if (existingGuide) {
      return res.status(409).json({
        error: "A guide with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create guide with all related data
    await createGuide(
      FName,
      LName,
      Email,
      hashedPassword,
      Country || null,
      About || null,
      FaceBook || null,
      Linkedin || null,
      Instagram || null,
      phoneNumbers,
      specializations,
      certificates,
      languages,
      Profile_Image
    );

    res.status(201).json({
      message: "Guide registered successfully", Profile_Image
    });
  } catch (err) {
    console.error("Guide registration error:", err);
    res.status(500).json({
      error: "Failed to register guide",
      message: err.message,
    });
  }
};

/***************************Login Guide**********************************/
export const loginGuide = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({
      error: "Valid email is required",
    });
  }

  if (!Password) {
    return res.status(400).json({
      error: "Password is required",
    });
  }

  try {
    const guide = await findGuideByEmail(Email);

    if (!guide) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(Password, guide.Password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken(Email);
    delete guide.Password;

    res.status(200).json({
      message: "Logged in successfully",
      token,
      guide,
    });
  } catch (err) {
    console.error("Guide login error:", err);
    res.status(500).json({
      error: "Failed to login",
      message: err.message,
    });
  }
};
