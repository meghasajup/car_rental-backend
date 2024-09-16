import express from 'express';
import { CreateMessage } from '../../controllers/nodemailerController.js';

const router = express.Router();

router.post('/create-message', CreateMessage);

export default router;
