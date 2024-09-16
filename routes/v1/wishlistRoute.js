import express from 'express';
import { addToWishlist, removeFromWishlist, getUserWishlist } from '../../controllers/wishlistController.js';
import { authUser } from '../../middlewares/userAuth.js';

const router = express.Router();

router.post('/add', authUser, addToWishlist);
router.delete('/remove/:carId', authUser, removeFromWishlist);
router.get('/get', authUser, getUserWishlist);

export default router;