import { Router } from 'express';
import * as auditController from '../controllers/audit.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';

const router = Router();

router.get('/', protect, restrictTo('admin'), auditController.getLogs);

export default router;
