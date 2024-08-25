import express from 'express';
import { removeWishlistById, getWishlistById, userWislList } from '../../controllers/wishlistController.js';
import { authUser } from '../../middlewares/userAuth.js';


const router = express.Router();


router.post('/addWislist', authUser, userWislList);
router.get('/getwishlist/:userId', authUser, getWishlistById);
router.delete("/removeWishlist/:userId", authUser, removeWishlistById);

export default router;