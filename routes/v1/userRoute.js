import express from 'express';
import { checkUser, userCreate, userLogin, userLogout, userProfile } from '../../controllers/userController.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authUser } from '../../middlewares/userAuth.js';
import { upload } from '../../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/create', upload.single('profileImage'), asyncHandler(userCreate));
router.post('/login', asyncHandler(userLogin));
router.get('/profile', authUser, asyncHandler(userProfile));
router.post("/logout", authUser, asyncHandler(userLogout));
router.get("/check-user", authUser, asyncHandler(checkUser));

export default router;