import express from 'express';
import { MakePayment } from '../../controllers/paymentController.js';
// import { authUser } from '../../middlewares/userAuth.js';

const router = express.Router();

router.post("/create-payment",MakePayment)

export default router; 