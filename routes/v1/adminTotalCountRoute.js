import express from 'express';
import { getTotalBookings, getTotalCars, getTotalReviews, getTotalUsers } from '../../controllers/adminTotalCounts.js';

const router = express.Router();

router.get('/users-total', getTotalUsers);
router.get('/cars-total', getTotalCars);
router.get('/bookings-total', getTotalBookings);
router.get('/reviews-total', getTotalReviews);

export default router;