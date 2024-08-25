import express from 'express';
import { createCar, deleteCar, getCarList, search, getCarListById, updateCar } from '../../controllers/carController.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { upload } from '../../middlewares/uploadMiddleware.js';
import { authUser } from '../../middlewares/userAuth.js';

const router = express.Router();

router.get('/carList', authUser, asyncHandler(getCarList));
router.get('/getCar/:id', authUser, asyncHandler(getCarListById));
router.get("/search",search)

router.post('/create', upload.single('image'), authUser, asyncHandler(createCar));
router.put('/update/:id', authUser, asyncHandler(updateCar));
router.delete('/delete/:id', authUser, asyncHandler(deleteCar));

export default router;