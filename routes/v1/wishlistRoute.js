import express from 'express';
import { removeWishlistById, getWishlistById, userWishList } from '../../controllers/wishlistController.js';
import { authUser } from '../../middlewares/userAuth.js';


const router = express.Router();


router.post('/addWishlist', authUser, userWishList);
router.get('/getWishlist/:userId', authUser, getWishlistById);
router.delete("/removeWishlist/:userId", authUser, removeWishlistById);

export default router;