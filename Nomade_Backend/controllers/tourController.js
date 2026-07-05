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
    tour_Description,
    Days,
    Nights,
  } = req.body;

  try {
    await createTour(
      Tour_name,
      Price_per_person,
      Country,
      City,
      Street,
      tour_Description,
      Days,
      Nights,
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
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Delete Tour
export const deleteTour = async (req, res) => {
  const { Tour_ID } = req.params;

  try {
    const result = await deleteTourById(Tour_ID);

    // check if tour  exist or not
    if (result.affectedRows == 0) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    res.status(200).json({
      message: "Tour deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Search and Filter Tours
export const searchTours = async (req, res) => {
  const { Country, City, Price_per_person } = req.query;

  try {
    const tours = await searchAndFilterTours(Country, City, Price_per_person);
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
