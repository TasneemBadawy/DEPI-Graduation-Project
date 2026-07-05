import {
  createActivity,
  getAllActivities,
  getActivityById,
  deleteActivityById,
} from "../models/activityModel.js";

// Validation helper functions
const validateActivityInput = (
  Activity_name,
  Category,
  Description,
  locations,
) => {
  const errors = [];

  if (!Activity_name || Activity_name.trim() === "") {
    errors.push("Activity name is required");
  } else if (Activity_name.length > 200) {
    errors.push("Activity name cannot exceed 200 characters");
  }

  if (Category && Category.length > 200) {
    errors.push("Category cannot exceed 200 characters");
  }

  if (Description && Description.length > 65535) {
    errors.push("Description is too long");
  }

  if (locations && locations.length > 0) {
    locations.forEach((loc, index) => {
      if (!loc.Street || loc.Street.trim() === "") {
        errors.push(`Location ${index + 1}: Street is required`);
      } else if (loc.Street.length > 150) {
        errors.push(
          `Location ${index + 1}: Street cannot exceed 150 characters`,
        );
      }

      if (!loc.City || loc.City.trim() === "") {
        errors.push(`Location ${index + 1}: City is required`);
      } else if (loc.City.length > 50) {
        errors.push(`Location ${index + 1}: City cannot exceed 50 characters`);
      }

      if (!loc.Country || loc.Country.trim() === "") {
        errors.push(`Location ${index + 1}: Country is required`);
      } else if (loc.Country.length > 50) {
        errors.push(
          `Location ${index + 1}: Country cannot exceed 50 characters`,
        );
      }
    });
  }

  return errors;
};

//  Add a new activity
export const addActivity = async (req, res) => {
  const { Activity_name, Category, Description, locations = [] } = req.body;

  // Validate input
  const validationErrors = validateActivityInput(
    Activity_name,
    Category,
    Description,
    locations,
  );
  if (validationErrors.length > 0) {
    return res.status(400).json({
      errors: validationErrors,
    });
  }

  try {
    const result = await createActivity(
      Activity_name,
      Category || null,
      Description || null,
      locations,
    );

    res.status(201).json({
      message: "Activity created successfully",
    });
  } catch (err) {
    console.error("Error creating activity:", err);
    res.status(500).json({
      error: "Failed to create activity",
      message: err.message,
    });
  }
};

// GET all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await getAllActivities();
    res.status(200).json({
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({
      error: "Failed to retrieve activities",
      message: err.message,
    });
  }
};

// GET single activity
export const getActivity = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Invalid activity ID",
    });
  }

  try {
    const activity = await getActivityById(id);

    if (!activity) {
      return res.status(404).json({
        error: "Activity not found",
      });
    }

    res.status(200).json({
      data: activity,
    });
  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({
      error: "Failed to retrieve activity",
      message: err.message,
    });
  }
};
// DELETE  an activity
export const deleteActivity = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Invalid activity ID",
    });
  }

  try {
    // Check if activity exists first
    const activity = await getActivityById(id);
    if (!activity) {
      return res.status(404).json({
        error: "Activity not found",
      });
    }

    const result = await deleteActivityById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Activity not found",
      });
    }

    res.status(200).json({
      message: "Activity deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting activity:", err);
    res.status(500).json({
      error: "Failed to delete activity",
      message: err.message,
    });
  }
};
