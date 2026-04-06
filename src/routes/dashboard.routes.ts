import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/summary', protect, dashboardController.getSummary);

export default router;
