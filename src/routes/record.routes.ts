import { Router } from 'express';
import * as recordController from '../controllers/record.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';

const router = Router();

router.route('/')
  .get(protect, restrictTo('analyst', 'admin'), recordController.getRecords)
  .post(protect, restrictTo('admin'), recordController.createRecord);

router.get('/export', protect, restrictTo('analyst', 'admin'), recordController.exportRecords);

router.route('/:id')
  .put(protect, restrictTo('admin'), recordController.updateRecord)
  .delete(protect, restrictTo('admin'), recordController.deleteRecord);

export default router;
