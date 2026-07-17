import { 
  createReview, 
  getReviewsByPlace, 
  getReviewsByUserId, 
  deleteReview, 
  getReviewById
} from '../models/reviewModel.js';

// add a review
export const addReview = async (req, res) => {
  const {
    User_ID,
    Guide_ID,
    Title,
    Rate,
    username,
    Content
  } = req.body;
  
  if (!Content) {
    return res.status(400).json({
      message: "Review content is required"
    });
  }

  if (Rate < 1 || Rate > 5) {
    return res.status(400).json({
      message: "Rate must be between 1 and 5"
    });
  }

  try {
    await createReview(User_ID, Guide_ID, Title, Rate, username, Content);
    res.status(201).json({
      message: "Review created successfully",
    });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({
      error: err.message,
      message: "can't be added"
    });
  }
};

// ✅ FIXED: Get reviews by Guide ID
export const getReviewsWithPlace = async (req, res) => {
  const { guideId } = req.params;
  
  console.log(`Fetching reviews for guide ID: ${guideId}`);

  try {
    const reviews = await getReviewsByPlace(guideId);
    console.log(`Found ${reviews.length} reviews for guide ${guideId}`);
    res.status(200).json(reviews || []);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    // Always return an array, never an error
    res.status(200).json([]);
  }
};

export const getReviewsWithUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await getReviewsByUserId(id);
    res.status(200).json(review || []);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(200).json([]);
  }
};

export const RemoveReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await getReviewById(id);

    if (review.length === 0) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    await deleteReview(id);

    res.status(200).json({
      message: "Review deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({
      error: err.message
    });
  }
};