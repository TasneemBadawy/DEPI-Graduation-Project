import {
  createTour,
  getAllTours,
  getSingleTour,
  deleteTourById,
  searchAndFilterTours,
} from "../models/tourModel.js";

// Add Tour
export const addTour = async (req, res) => {
  const {
    Tour_name,
    Price_per_person,
    Country,
    City,
    Street,
    Description,
    Days,
    Nights,
  } = req.body;

  const imagePaths = req.files
  ? req.files.map(file => file.path)
  : [];

  try {
    await createTour(
      Tour_name,
      Price_per_person,
      Country,
      City,
      Street,
      Description,
      Days,
      Nights,
     imagePaths,
    );

    res.status(201).json({
      message: "Tour created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Get all tours
export const getTours = async (req, res) => {
  try {
    const tours = await getAllTours();
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Get single tour
export const getOneTour = async (req, res) => {
  const { Tour_ID } = req.params;

  try {
    const tour = await getSingleTour(Tour_ID);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Delete tour
export const deleteTour = async (req, res) => {
  const { Tour_ID } = req.params;

  try {
    await deleteTourById(Tour_ID);
    res.status(200).json({
      message: "Tour deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Search Tours
export const searchTours = async (req, res) => {
  const country = req.query.country || req.query.Country;
  const city = req.query.city || req.query.City;
  const price = req.query.Price || req.query.price;

  try {
    const tours = await searchAndFilterTours(country, city, price);
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
