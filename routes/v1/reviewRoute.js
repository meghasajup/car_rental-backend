import express from 'express';
// import { validateReviewToken } from '../../middlewares/authReviewMiddleWare.js';
import { createReview, deleteCarReview, getCarReview, getReviewsByCarId, updateCarReview } from '../../controllers/reviewController.js';
import { authUser } from '../../middlewares/userAuth.js';

const router = express.Router();

// Route to create a review
router.post('/createReviews', authUser, createReview);
router.get("/getReview", authUser, getCarReview);
router.get("/getReviewsByCarId/:carId", authUser, getReviewsByCarId);router.put("/updateCarReview/:id", authUser, updateCarReview);
router.delete("/deleteReview/:id", authUser, deleteCarReview);

export default router;