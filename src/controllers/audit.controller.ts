import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AuditLog from '../models/AuditLog.model';

export const getLogs = catchAsync(async (req: Request, res: Response) => {
  const logs = await AuditLog.find()
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: {
      logs,
    },
  });
});
