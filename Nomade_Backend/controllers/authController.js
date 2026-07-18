import bcrypt from "bcrypt";
import { findTouristByEmail, createTourist } from "../models/touristModel.js";
import { findGuideByEmail, createGuide } from "../models/guideModel.js";
import { findAdminByEmail, createAdmin } from "../models/adminModel.js";
import { generateToken } from "../utils/generateToken.js";

/******************************Validations*******************************************/
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateSocialMediaUrl = (url) => {
  if (!url || url === "") return true;
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
  return urlRegex.test(url);
};

/******************************Tourist*******************************************/

/***************************Register Tourist**************************/
export const registerTourist = async (req, res) => {
  const { FName, LName, Email, Password } = req.body;
  const Profile_Image = req.file ? req.file.path : null;

  if (!FName || FName.trim() === "" || !LName || LName.trim() === "") {
    return res.status(400).json({ error: "First name and Last name are required." });
  }
  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!Password || Password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const existedUser = await findTouristByEmail(Email);
    if (existedUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashPassword = await bcrypt.hash(Password, 10);
    await createTourist(FName, LName, Email, hashPassword, Profile_Image);

    res.status(201).json({
      message: "Tourist registered successfully.",
      Profile_Image,
    });
  } catch (err) {
    console.error("Tourist registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

/*************************** Login Tourist ***************************/
export const logInTourist = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (!Password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const tourist = await findTouristByEmail(Email);
    if (!tourist) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(Password, tourist.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(tourist.User_ID, "tourist");
    delete tourist.Password;

    res.status(200).json({
      message: "Logged in successfully",
      token,
      tourist,
    });
  } catch (err) {
    console.error("Tourist login error:", err);
    res.status(500).json({ error: "Failed to login", message: err.message });
  }
};

/******************************Guide********************************************/

/***************************Register Guide**********************************/
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

  const Profile_Image = req.file ? req.file.path : null;

  const errors = [];
  if (!FName || FName.trim() === "") errors.push("First name is required");
  if (!LName || LName.trim() === "") errors.push("Last name is required");
  if (!Email || !validateEmail(Email)) errors.push("Valid email is required");
  if (!Password || !validatePassword(Password)) errors.push("Password must be at least 6 characters");
  if (FaceBook && !validateSocialMediaUrl(FaceBook)) errors.push("Invalid Facebook URL");
  if (Linkedin && !validateSocialMediaUrl(Linkedin)) errors.push("Invalid LinkedIn URL");
  if (Instagram && !validateSocialMediaUrl(Instagram)) errors.push("Invalid Instagram URL");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingGuide = await findGuideByEmail(Email);
    if (existingGuide) {
      return res.status(409).json({ error: "A guide with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
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
      Profile_Image,
    );

    res.status(201).json({
      message: "Guide registered successfully",
      Profile_Image,
    });
  } catch (err) {
    console.error("Guide registration error:", err);
    res.status(500).json({ error: "Failed to register guide", message: err.message });
  }
};

/***************************Login Guide**********************************/
export const loginGuide = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (!Password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const guide = await findGuideByEmail(Email);
    if (!guide) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(Password, guide.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(guide.Guide_ID, "guide");
    delete guide.Password;

    res.status(200).json({
      message: "Logged in successfully",
      token,
      guide,
    });
  } catch (err) {
    console.error("Guide login error:", err);
    res.status(500).json({ error: "Failed to login", message: err.message });
  }
};

/******************************Admin********************************************/

/***************************Register Admin**********************************/
export const registerAdmin = async (req, res) => {
  const { FName, LName, Email, Password } = req.body;
  const Profile_Image = req.file ? req.file.path : null;

  if (!FName || FName.trim() === "" || !LName || LName.trim() === "") {
    return res.status(400).json({ error: "First name and Last name are required." });
  }
  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!Password || Password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const existingAdmin = await findAdminByEmail(Email);
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }

    const hashPassword = await bcrypt.hash(Password, 10);
    await createAdmin(FName, LName, Email, hashPassword, Profile_Image);

    res.status(201).json({
      message: "Admin registered successfully.",
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

/***************************Login Admin**********************************/
export const loginAdmin = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !validateEmail(Email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (!Password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const admin = await findAdminByEmail(Email);
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(Password, admin.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(admin.Admin_ID, "admin");
    delete admin.Password;

    res.status(200).json({
      message: "Logged in successfully",
      token,
      admin,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Failed to login", message: err.message });
  }
};