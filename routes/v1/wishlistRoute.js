import express from 'express';
import { removeWishlistById, getWishlistById, userWishList } from '../../controllers/wishlistController.js';
import { authUser } from '../../middlewares/userAuth.js';


const router = express.Router();


router.post('/addWishlist', authUser, userWishList);
router.get('/getWishlist/:Id', authUser, getWishlistById);
router.delete("/removeWishlist/:Id", authUser, removeWishlistById);

export default router;